import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../css/TechConnectChatPanel.css"
import stompClient from '../service/WebSocket';
import socket from '../service/WebSocket';
import socketConnection from '../service/WebSocket';

function FileUpload({ loginEmployee, stompClient }) {
    // const [loginEmployee, setLoginEmployee] = useState({})
    const [file, setFile] = useState(null);
    // const [stompClient, setStompClient] = useState(null);

    useEffect(()=>{
        // const client=Stomp.over(socket)
        // client.connect({},()=>{
        //     setStompClient(client)
        // });    
        // const client=socketConnection()
        // client.connect({},()=>{
        //     setStompClient(client)
        // });
    }, [])

    const handleFileChange = (event) => {
        console.log(event);
        //upload file upto 1 gbs
        const fileSize = event.target.files[0].size
        if(fileSize >= 1073741824 ){
            alert("Please upload file less than 1 GB")
            event.target.value = null; // Clear the file input value
        }else   {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = (event) => {
        event.preventDefault()
        const attachmentData = {
            name: file.name,
            size: file.size,
            type: file.type
        };
        const newMessage = {
            sender: loginEmployee.ename,
            message: '',
            timestamp: new Date().toLocaleString(),
            type: 'FILE',
            attachment: attachmentData
        };

        stompClient.send('/app/upload', {}, JSON.stringify(newMessage))

    };

    return (
        <div>
            <form onSubmit={(e)=>handleUpload(e)}>
                <input type="file" onChange={handleFileChange} required/>
                <button type="submit" className="upload-button" >Upload</button>
            </form>
        </div>
    );
}

export default FileUpload
