import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import "../css/TechConnectChatPanel.css"
import profile from "../assets/uichat.png"
import groupprofile from "../assets/groupprofile.jpeg"
import employeeprofile from "../assets/employee.png"

import { FaDotCircle } from "react-icons/fa"
import { CgAttachment } from "react-icons/cg";

import { getGroups } from '../service/GroupService';
import { getUsers } from '../service/UserService';
import { getChatPanelData, logOut } from '../service/ChatPanelService';
import FileUpload from './FileUpload';

import stompClient from '../service/WebSocket';
import socket from '../service/WebSocket';
import socketConnection from '../service/WebSocket';


function TechConnectChatPanel() {
    const [text, setText] = useState('');
    // const [messages, setMessages] = useState();
    const [receivedMessage, setReceivedMessage] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [chatpanelGroupData, setChatpanelGroupData] = useState({users: []})
    const [loginEmployee, setLoginEmployee] = useState({})
    const [isUploadFile, setIsUploadFile] = useState(false)

    const navigate = useNavigate()

    useEffect(()=>{  
        let loginuser = JSON.parse(localStorage.getItem('loginuser'))
        if(!loginuser){
            navigate('/login')
        }else{
            // const socket=new SockJS("http://localhost:8080/server1")
            // const client=Stomp.over(socket)
            const client=socketConnection()
            if(navigator.onLine){
    
                client.connect({},()=>{
                    setStompClient(client)
                    console.log("connected", loginEmployee.ename)
                    // onlineUsers.set(loginEmployee.eid, loginEmployee.ename)
                    // console.log("online users ", onlineUsers)
                    client.subscribe("/topic/return-to",(response)=>{
                        try {
                            const receivedMsg = JSON.parse(response.body);
                            console.log("Received message:", receivedMsg);
                            console.log("Received message attachment:", receivedMsg.attachment?.name);
                            setReceivedMessage((prevMessages) => [...prevMessages, receivedMsg]);
                        } catch (error) {
                            console.error("Error parsing JSON:", error);                    
                        }
                    });
            
                    client.subscribe("/topic/logout",(response)=>{
                        try {
                            console.log("logout user : ", JSON.parse(response.body));
                            const logoutUser = JSON.parse(response.body);
                            // Update chat panel data to mark the user as offline
                            setChatpanelGroupData(prevData => ({
                                ...prevData,
                                users: prevData.users.map(user => {
                                    if (user.eid === logoutUser.userId) {
                                        return { ...user, onlineStatus: false };
                                    }
                                    return user;
                                })
                            }));
        
                        } catch (error) {
                            console.error("Error parsing JSON:", error);                    
                        }
                    });
                   
                  
                })
        
        
                return () => {
                    client.disconnect();
                };
            }
            else{
                alert("No Internet Connection")
            }

        }
                  

    },[])

    useEffect(()=>{
        fetchChatPanelData()
    }, [stompClient])

    
    function fetchChatPanelData(){
        const urlParams = new URLSearchParams(window.location.search)
        const groupId = urlParams.get('groupId')
        const empId = urlParams.get('employeeId')

            // getChatPanelData(groupId, empId).then((res)=>{
            //     console.log(res)
            //     if(res.status == 200){
            //         
            //         // setLoginEmployee(res.data.loginEmployee)
            //         setLoginEmployee(JSON.parse(localStorage.getItem('loginuser')));
            //         stompClient.send('/app/login', {}, JSON.stringify({ userId: empId }));
    
            //         stompClient.subscribe("/topic/login",(response)=>{
            //         try {
            //             console.log("loginUser user : ", JSON.parse(response.body));
            //             const loginUser = JSON.parse(response.body);
            //             // Update chat panel data to mark the user as offline
            //             setChatpanelGroupData(prevData => ({
            //                 ...prevData,
            //                 users: prevData.users.map(user => {
            //                     if (user.eid === loginUser.userId) {
            //                         return { ...user, onlineStatus: true};
            //                     }
            //                     return user;
            //                 })
            //             }));
    
            //         } catch (error) {
            //             console.error("Error parsing JSON:", error);                    
            //         }
            //     });
            //     }
            // }).catch((error)=>{
            //     console.log(error)
            // })

            getGroups().then((res)=>{
                console.log("groups ", res)
                if(res.status === 200){
                    let group = res.data.find((group)=>group.gid === groupId)
                    setChatpanelGroupData(group)
                    console.log("chatpanelGroupData ",chatpanelGroupData)
                    setLoginEmployee(JSON.parse(localStorage.getItem('loginuser')));
                    stompClient.send('/app/login', {}, JSON.stringify({ userId: empId }));

                    stompClient.subscribe("/topic/login",(response)=>{
                        try {
                            console.log("loginUser user : ", JSON.parse(response.body));
                            const loginUser = JSON.parse(response.body);
                            // Update chat panel data to mark the user as offline
                            setChatpanelGroupData(prevData => ({
                                ...prevData,
                                users: prevData.users.map(user => {
                                    if (user.eid === loginUser.userId) {
                                        return { ...user, onlineStatus: true};
                                    }
                                    return user;
                                })
                            }));
        
                        } catch (error) {
                            console.error("Error parsing JSON:", error);                    
                        }
                    });
                }else{
                    alert("Something went wrong")
                }
            }).catch((error)=>{
                console.log(error)
            })



    }

    const handleTextChange = (e) => {
        setText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';        
    };

    const handleSendMessage = (e) => {
        if (text.trim() !== '') {
            const newMessage = {
                sender: loginEmployee.ename,
                message: text,
                timestamp: new Date().toLocaleString(),
                type: 'TEXT'
            };
            // document.getElementsByClassName("message").classList.add('sent')
            stompClient.send("/app/message",{}, JSON.stringify(newMessage));
            setText('');
        }

    }

    function uploadAttachment(){
        console.log("upload click")
        setIsUploadFile(true)
    }

    function cancelAttachment(){
        setIsUploadFile(false)
    }

    function userLogout(loginEmployee){
        console.log("loginuser ",loginEmployee.eid)
        if(navigator.onLine){
            let loginuser = JSON.parse(localStorage.getItem('loginuser'))
            logOut(loginuser.eid).then((res)=>{
                console.log(res)
                notifyLogout(loginuser.eid)
                // alert("Logout successfully!")
                navigate('/login')
                localStorage.removeItem('loginuser');
                localStorage.removeItem('redirecturl');
                stompClient.disconnect();
            })

        }else{
            alert("No Internet Connection, You are offline")
        }
    }

    // Notify other users about user logout
    function notifyLogout(loggedOutUserId) {
        // Send a WebSocket message to notify other users
        stompClient.send('/app/logout', {}, JSON.stringify({ userId: loggedOutUserId }));
    }

// automatically logout after 12 hrs ------------------------------------

    useEffect(()=>{
        console.log("loginuser ",loginEmployee)  
        let logoutTimer
        if(loginEmployee){
            logoutTimer = setTimeout(()=>{
                let loginuser = JSON.parse(localStorage.getItem('loginuser'))
                userLogout(loginuser)
            }, 12*60*60*1000)
        }

        return ()=>{
            clearTimeout(logoutTimer)
        }
    },[loginEmployee])


    console.log(text)
    console.log(receivedMessage)
    document.title = "Techorp - Roshan Pawar"
    return (
        <div>
            <div className="header-container">
                <h1>TechConnect</h1>
                <button className="btn btn-secondary" onClick={()=>userLogout(loginEmployee)}>Logout</button>
            </div>
            <div className='panel-container' >
                <div className="grp-members">
                    <h3>TechCorp</h3>
                    <h6 style={{ color: "green" }}>{chatpanelGroupData.gdname}</h6>
                    <hr />
                    <h5>Group Members</h5>
                    <ul>
                        {
                            chatpanelGroupData.users.map((user,i)=>{return <li key={i}> {user.ename} { user.onlineStatus && navigator.onLine
                                                                                ? <span style={{ color: 'green' }}> (Online)</span> 
                                                                                : <span style={{ color: 'red' }}> (Offline)</span>}
                                                                            </li>})
                        }
                    </ul>
                </div>
                <div className="chats">
                    <div className='h-gp-tn'>
                        <img src={groupprofile} alt="Group profile" />
                        <div className="hd">
                            <h3>{chatpanelGroupData.gname}</h3>
                            <h6>{chatpanelGroupData.gtname}</h6>
                        </div>
                    </div>
                    <hr />
                    <div className="messages-container">
                        {
                            receivedMessage.map((rmsg,index)=>{
                                return (
                                    <div key={index} className={`message ${rmsg.sender === loginEmployee.ename ? 'sent' : 'received'}`}>
                                        <div className="sender">{rmsg.sender}</div>
                                        <pre className="message-text">{rmsg.message}</pre>
                                        <div className="timestamp"><small>{rmsg.timestamp}</small></div>
                                    </div> 
                                )
                            })
                        }
                        
                    </div>
                    {
                        !isUploadFile ? 
                            <div className="input-container">
                                    <div className='msg-writter'>
                                        <textarea type="text" id="message-input" placeholder="Type your message..." onChange={handleTextChange} value={text} />
                                        <button className="send-button" onClick={handleSendMessage}>Send</button>
                                    </div>
                                    <div>
                                        <CgAttachment onClick={uploadAttachment} className='attachment'  title='File Attachment'/>
                                    </div>
                            </div>
                        :
                            <div className='upload-file-container'>
                                <FileUpload loginEmployee={loginEmployee} stompClient={stompClient} />
                                <button className="cancel-button" onClick={cancelAttachment}>Cancel</button>                          
                            </div>
                    }
                </div>
                <div className="emp-profile">
                    <img src={employeeprofile} alt="Employee profile" />
                    <b>{loginEmployee.ename}</b>
                    <p >{loginEmployee.onlineStatus && navigator.onLine ? <span style={{ color: 'green' }}> Active <FaDotCircle /></span> 
                                    : <span style={{ color: 'red' }}> Offline </span>}
                                    
                    </p> 
                    <table className="table text-center table-striped ">
                        <thead>
                            <tr>
                                <th scope="col">Emp ID</th>
                                <td scope="col">{loginEmployee.eid}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Email</th>
                                <td>{loginEmployee.eemail}</td>
                            </tr>
                            {/* <tr>
                                <th scope="row">Role</th>
                                <td>Junior Developer</td>
                            </tr> */}
                            <tr>
                                <th scope="row">Date of Joined</th>
                                <td>{String(loginEmployee.date_joined).slice(0,10)}</td>
                            </tr>
                            <tr>
                                <th scope="row">Group ID</th>
                                <td>{chatpanelGroupData.gid}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TechConnectChatPanel
