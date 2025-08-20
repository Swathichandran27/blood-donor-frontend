import React, { useEffect, useState, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Sidebar from "./Sidebar";
import AuthService from "../services/AuthService";
import { FaUser, FaPaperclip, FaMicrophone, FaEllipsisV } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import styles from "./Chat.module.css";

const Chat = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const user = AuthService.getUserData();
  if (!user?.id) window.location.href = "/login";

  const userId = user.id;
  const username = user.name || "Donor";

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS("https://blood-donor-backend-cibk.onrender.com/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);

        stompClient.subscribe("/topic/public", (msg) => {
          const received = JSON.parse(msg.body);
          const messageWithStatus = {
            ...received,
            status: received.sender === userId ? "DELIVERED" : undefined
          };
          setMessages(prev => [...prev, messageWithStatus]);
          if (!isFocused) setUnreadCount(prev => prev + 1);
        });

        stompClient.subscribe("/topic/typing", (msg) => {
          const data = JSON.parse(msg.body);
          if (data.sender !== userId) {
            if (data.typing) {
              setTypingUsers(prev => [...new Set([...prev, data.sender])]);
            } else {
              setTypingUsers(prev => prev.filter(u => u !== data.sender));
            }
          }
        });

        stompClient.subscribe("/topic/users", (msg) => setOnlineUsers(parseInt(msg.body)));

        stompClient.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: userId, username, type: "JOIN" })
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error("Broker error:", frame.body)
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [userId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isFocused) setUnreadCount(0);
  }, [messages, isFocused]);

  useEffect(() => {
    if (client && connected) {
      client.publish({
        destination: "/app/chat.typing",
        body: JSON.stringify({ sender: userId, typing })
      });
    }
  }, [typing, client, connected, userId]);

  const sendMessage = useCallback(() => {
    if (client && connected && message.trim() !== "") {
      const chatMessage = {
        sender: userId,
        username,
        content: message,
        timestamp: new Date().toISOString(),
        status: "SENT"
      };
      client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage)
      });
      setMessage("");
      setTyping(false);
    }
  }, [client, connected, message, userId, username]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) setTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 2000);
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getMessageStatus = (status, isMine) => {
    if (!isMine) return null;
    switch (status) {
      case "DELIVERED": return <BsCheck2All className={styles.deliveredIcon} />;
      case "READ": return <BsCheck2All className={styles.readIcon} />;
      default: return <BsCheck2 className={styles.sentIcon} />;
    }
  };

  return (
    <div className={styles.donorDashboard}>
      <div className={styles.dashboardRow}>
        <div className={styles.sidebarColumn}><Sidebar /></div>

        <div className={styles.chatColumn}>
          <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
              <div className={styles.chatInfo}>
                <div className={styles.chatTitle}>Donor Support Center</div>
                <div className={styles.chatStatus}>
                  {typingUsers.length > 0
                    ? `${typingUsers.join(", ")} ${typingUsers.length > 1 ? "are" : "is"} typing...`
                    : `${onlineUsers} ${onlineUsers === 1 ? "person" : "people"} online`}
                </div>
              </div>
              <div className={styles.chatActions}><FaEllipsisV /></div>
            </div>

            <div
              className={styles.messagesArea}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              tabIndex="0"
            >
              {messages.length === 0 ? (
                <div className={styles.welcomeMessage}>
                  <h3>Welcome to Donor Support Chat</h3>
                  <p>Ask questions about donations, eligibility, or schedule appointments</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.sender === userId;
                  const isAdmin = msg.sender === "Admin" || msg.sender === "support";
                  const senderName = isAdmin ? "Admin" : msg.username;

                  return (
                    <div
                      key={idx}
                      className={`${styles.messageContainer} ${
                        isMine ? styles.myMessageContainer : isAdmin ? styles.adminMessageContainer : styles.otherMessageContainer
                      }`}
                    >
                      {!isMine && <div className={styles.avatar}><FaUser /></div>}
                      <div className={styles.messageContent}>
                        {!isMine && <div className={styles.senderName}>{senderName}</div>}
                        <div className={`${styles.message} ${isMine ? styles.myMessage : isAdmin ? styles.adminMessage : styles.otherMessage}`}>
                          {msg.content}
                          <div className={styles.messageMeta}>
                            <span className={styles.time}>{formatTime(msg.timestamp)}</span>
                            {isMine && getMessageStatus(msg.status, isMine)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInputArea}>
              <button className={styles.attachmentButton}><FaPaperclip /></button>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className={styles.input}
                />
              </div>
              {message.trim()
                ? <button onClick={sendMessage} className={styles.sendButton}><IoMdSend /></button>
                : <button className={styles.voiceButton}><FaMicrophone /></button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
