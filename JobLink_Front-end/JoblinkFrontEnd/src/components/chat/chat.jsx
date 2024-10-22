import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/chathub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");
          connection.on("ReceiveMessage", (user, message) => {
            setMessages((prevMessages) => [...prevMessages, { user, message }]);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection.connectionStarted) {
      try {
        await connection.send("SendMessage", "User1", message);
        setMessage("");
      } catch (e) {
        console.error("Sending message failed: ", e);
      }
    }
  };

  return (
    <div>
      <div>
        {messages.map((m, index) => (
          <div key={index}>
            <strong>{m.user}</strong>: {m.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
