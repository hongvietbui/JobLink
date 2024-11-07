import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

const conversations = [
    { id: 1, name: "Alice Smith", lastMessage: "Hey, how are you?", time: "10:30 AM" },
    { id: 2, name: "Bob Johnson", lastMessage: "Can we meet tomorrow?", time: "Yesterday" },
    { id: 3, name: "Carol Williams", lastMessage: "Thanks for your help!", time: "2 days ago" },
    { id: 4, name: "David Brown", lastMessage: "See you later!", time: "1 week ago" },
  ]
  
  const messages = [
    { id: 1, sender: "Alice", content: "Hi there! How's it going?", time: "10:30 AM" },
    { id: 2, sender: "You", content: "Hey Alice! I'm doing well, thanks. How about you?", time: "10:31 AM" },
    { id: 3, sender: "Alice", content: "I'm good too! Just wanted to check in.", time: "10:32 AM" },
    { id: 4, sender: "You", content: "That's nice of you. Anything exciting happening?", time: "10:33 AM" },
    { id: 5, sender: "Alice", content: "Not much, just working on some projects. How about you?", time: "10:34 AM" },
  ]
  
  export default function ChatInterface() {
    const [newMessage, setNewMessage] = useState("")
  
    const handleSendMessage = (e) => {
      e.preventDefault()
      if (newMessage.trim()) {
        // Here you would typically send the message to your backend
        console.log("Sending message:", newMessage)
        setNewMessage("")
      }
    }
  
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Conversation List */}
        <Card className="w-1/4 h-full rounded-none">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-120px)]">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${conversation.name.charAt(0)}`} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                  <span className="text-xs text-gray-400">{conversation.time}</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
  
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
            <ScrollArea className="flex-1 pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex mb-4 ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "You" ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }