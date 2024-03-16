import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import "../css/TechConnectChatPanel.css"
import profile from "../assets/uichat.png"

import { FaDotCircle } from "react-icons/fa"


function TechConnectChatPanel() {
    const [text, setText] = useState('');
    // const [messages, setMessages] = useState();
    const [receivedMessage, setReceivedMessage] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    const navigate = useNavigate()

    useEffect(()=>{       
        
        const socket=new SockJS("http://localhost:8080/server1")
        const client=Stomp.over(socket)
        setStompClient(client)

        client.connect({},()=>{
            console.log("connected")
            client.subscribe("/topic/return-to",(response)=>{
                try {
                    const receivedMsg = JSON.parse(response.body);
                    // console.log("Received message:", receivedMsg);
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

    const handleTextChange = (e) => {
        setText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';        
    };

    const handleSendMessage = (e) => {
        if (text.trim() !== '') {
            const newMessage = {
                // sender: 'You',
                message: text,
                // timestamp: new Date().toLocaleString(),
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
    }
    console.log(text)
    console.log(receivedMessage)
    document.title = "Techorp - Roshan Pawar"
    return (
        <div>
            <div className="header-container">
                <h1>TechConnect</h1>
                <button class="btn btn-secondary" onClick={userLogout}>Logout</button>
            </div>
            <div className='panel-container' >
                <div className="grp-members">
                    <h3>TechCorp</h3>
                    <h6 style={{ color: "green" }}>IT DEPARTMENT</h6>
                    <hr />
                    <h5>Group Members</h5>
                    <ul>
                        <li>Roshan Pawar <span style={{ color: "red" }}>{"(Admin)"}</span> <span><FaDotCircle /></span></li>
                        <li>Harsh Avadhan <span><FaDotCircle /></span></li>
                        <li>Raj Majhi</li>
                        <li>Omkar Shinde <span><FaDotCircle /></span></li>
                        <li>Hassan Khan</li>
                    </ul>
                </div>
                <div className="chats">
                    <div className='h-gp-tn'>
                        <img src={profile} alt="profile" />
                        <div className="hd">
                            <h3>Angular Developers</h3>
                            <h6>Angular Team</h6>
                        </div>
                    </div>
                    <hr />
                    <div className="messages-container">
                        {
                            receivedMessage.map((rmsg,index)=>{
                                return (
                                    <div key={index} className={`message ${rmsg.sender === 'You' ? 'sent' : 'received'}`}>
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
                    <img src={profile} alt="profile" />
                    <b>Omkar Shinde</b>
                    <p style={{ color: 'green' }}>Active <FaDotCircle /></p>
                    <table className="table text-center table-striped ">
                        <thead>
                            <tr>
                                <th scope="col">Emp ID</th>
                                <td scope="col">tce5846</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Email</th>
                                <td>omkar@gmail.com</td>
                            </tr>
                            <tr>
                                <th scope="row">Role</th>
                                <td>Junior Developer</td>
                            </tr>
                            <tr>
                                <th scope="row">Date of Joined</th>
                                <td>20 Dec 2023</td>
                            </tr>
                            <tr>
                                <th scope="row">Group ID</th>
                                <td>tcg4283</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TechConnectChatPanel
