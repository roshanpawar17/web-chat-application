import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


export default function socketConnection(){
    
    const socket=new SockJS("http://localhost:8080/server1")
    const stompClient=Stomp.over(socket)
    
    // export default socket;
    // export default stompClient;
    return stompClient
}