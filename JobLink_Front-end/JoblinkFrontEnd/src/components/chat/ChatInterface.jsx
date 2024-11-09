import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import useAuthStore from "@/stores/useAuthStore";
import * as signalR from "@microsoft/signalr";
import agent from "@/lib/axios";
import { useParams } from "react-router-dom";

export default function ChatInterface() {
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
            if (senderId !== id) {
              setMessages((prevMessages) => [
                ...(prevMessages || []),
                { senderId, content: receivedMessage },
              ]);
            }
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
    }
  }, [connection]);

  useEffect(() => {
    console.log("sdfdsf");
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
        console.log(message);
        setMessages((prev) => [...prev, { senderId: id, content: message }]);
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Chat Window */}
      <Card className="flex-1 h-full rounded-none">
        <CardHeader className="flex flex-row items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=A" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <CardTitle>Alice Smith</CardTitle>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100vh-200px)] flex flex-col">
          <ScrollArea className="flex-1 pr-4 max-h-[500px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.senderId === id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "You"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
          <Separator className="my-4" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
