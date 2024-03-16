import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import "../css/TechConnectChatPanel.css"
import profile from "../assets/uichat.png"
import groupprofile from "../assets/groupprofile.jpeg"
import employeeprofile from "../assets/employee.png"

import { FaDotCircle } from "react-icons/fa"

import { getGroups } from '../service/GroupService';
import { getUsers } from '../service/UserService';
import { getChatPanelData } from '../service/ChatPanelService';


function TechConnectChatPanel() {
    const [text, setText] = useState('');
    // const [messages, setMessages] = useState();
    const [receivedMessage, setReceivedMessage] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [chatpanelGroupData, setChatpanelGroupData] = useState({users: []})
    const [loginEmployee, setLoginEmployee] = useState({})
    const [onlineUser, setOnlineUser] = useState(false)
    const [loginUser, setLoginUser] = useState()

    const navigate = useNavigate()

    useEffect(()=>{  

        const urlParams = new URLSearchParams(window.location.search)
        const groupId = urlParams.get('groupId')
        const empId = urlParams.get('employeeId')

        console.log("groupId", groupId)
        console.log("empId", empId)

        getChatPanelData(groupId, empId).then((res)=>{
            console.log(res)
            if(res.status == 200){
                setChatpanelGroupData(res.data.groupData, )
                setLoginEmployee(res.data.loginEmployee)
            }
        }).catch((error)=>{
            console.log(error)
        })

        setLoginUser(JSON.parse(localStorage.getItem("loginuser")))
            
        const socket=new SockJS("http://localhost:8080/server1")
        const client=Stomp.over(socket)
        setStompClient(client)

        client.connect({},()=>{
            console.log("connected")
            setOnlineUser(navigator.onLine)
            client.subscribe("/topic/return-to",(response)=>{
                try {
                    const receivedMsg = JSON.parse(response.body);
                    console.log("Received message:", receivedMsg);
                    setReceivedMessage((prevMessages) => [...prevMessages, receivedMsg]);
                } catch (error) {
                    console.error("Error parsing JSON:", error);                    
                }
            });
    
           
        })


        return () => {
            client.disconnect();
        };

    },[])

    function isUserLoggedIn(user){
        
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
            };
            // document.getElementsByClassName("message").classList.add('sent')
            stompClient.send("/app/message",{}, JSON.stringify(newMessage));
            setText('');
        }

    }

    function userLogout(){
        alert("Logout successfully!")
        navigate('/login')
        localStorage.removeItem('loginuser');
        stompClient.disconnect();
    }


    console.log(text)
    console.log(receivedMessage)
    document.title = "Techorp - Roshan Pawar"
    return (
        <div>
            <div className="header-container">
                <h1>TechConnect</h1>
                <button className="btn btn-secondary" onClick={userLogout}>Logout</button>
            </div>
            <div className='panel-container' >
                <div className="grp-members">
                    <h3>TechCorp</h3>
                    <h6 style={{ color: "green" }}>{chatpanelGroupData.gdname}</h6>
                    <hr />
                    <h5>Group Members</h5>
                    <ul>
                        {
                            chatpanelGroupData.users.map((user,i)=>{return <li key={i}> {user.ename} { isUserLoggedIn(user)
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
                    <div className="input-container">
                        <textarea type="text" id="message-input" placeholder="Type your message..." onChange={handleTextChange} value={text} />
                        <button id="send-button" onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
                <div className="emp-profile">
                    <img src={employeeprofile} alt="Employee profile" />
                    <b>{loginEmployee.ename}</b>
                    <p >{onlineUser ? <span style={{ color: 'green' }}> Active <FaDotCircle /></span> 
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
