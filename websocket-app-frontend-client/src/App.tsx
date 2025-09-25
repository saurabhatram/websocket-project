import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  useEffect(() => {  
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send('Hello Server!');
      setSocket(socket);
    };

    socket.onmessage = (message) => {
      console.log('Message from server ', message.data);
      setLatestMessage(message.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(socket);

    // Cleanup on unmount
    return () => {
      socket.close();
    };
   }, []);

  if (!socket) {
    return <div>Connecting to WebSocket...</div>;
  }



  return (
    <>
      <div className="chat-container">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={() => {
          if (socket && socket.readyState === WebSocket.OPEN && inputMessage.trim()) {
            socket.send(inputMessage);
            setInputMessage("");
          }
        }}>Send Message</button>
        <div className="messages">
          <p>Latest message: {latestMessage}</p>
        </div>
      </div>
      <div>{latestMessage}</div> 
    </>
  )
}

export default App
