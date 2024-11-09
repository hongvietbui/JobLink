// src/components/Chat.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import useAuthStore from "@/stores/useAuthStore";
import agent from "@/lib/axios";

const Home = () => {
  const { conversationId } = useParams();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { id } = useAuthStore();
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `http://localhost:8080/hub/conversation?conversationId=${conversationId}`
      )
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [id]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR");

          connection.on("ReceiveNewMessage", (senderId, receivedMessage) => {
            setMessages((prevMessages) => [
              ...(prevMessages || []),
              { senderId, content: message },
            ]);
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
    }
  }, [connection]);

  useEffect(() => {
    console.log('sdfdsf')
    const fetchMessages = async () => {
      try {
        const response = await agent.Chat.getAllMessage(conversationId);
        setMessages(response);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };
    fetchMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    if (connection) {
      try {
        await connection.invoke("SendNewMessage", conversationId, id, message);
        setMessages((prev) => [...prev, { senderId: id, content: message }]);
        setMessage("");
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div className="message-list">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={msg.senderId === id ? "sent" : "received"}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Home;
