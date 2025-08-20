import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styles from "./AdminChat.module.css"; // Create a CSS module for styling

const AdminChat = () => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/public", (msg) => {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  // Scroll to bottom whenever new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: "Admin", // mark sender as admin
        content: input,
        timestamp: new Date().toISOString()
      };
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(message),
      });
      setInput("");
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <h2>Admin Chat</h2>
      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${msg.sender === "Admin" ? styles.adminMessage : styles.userMessage}`}
          >
            <span className={styles.sender}>{msg.sender}:</span> {msg.content}
            <div className={styles.time}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AdminChat;
