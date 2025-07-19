"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: number
  text: string
  sender: "user" | "admin"
  timestamp: Date
}

interface MessagingProps {
  isOpen: boolean
  onClose: () => void
}

export function Messaging({ isOpen, onClose }: MessagingProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      sender: "admin",
      timestamp: new Date(Date.now() - 300000),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage("")

      // Simulate admin response
      setTimeout(() => {
        const adminResponse: Message = {
          id: messages.length + 2,
          text: "Merci pour votre message ! Un de nos conseillers vous répondra dans les plus brefs délais.",
          sender: "admin",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, adminResponse])
      }, 1000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-4 right-4 z-50 w-80 h-96"
        >
          <Card className="h-full flex flex-col shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Support Polyglotte</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback
                            className={message.sender === "admin" ? "bg-blue-100 text-blue-600" : "bg-gray-100"}
                          >
                            {message.sender === "admin" ? "A" : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 text-sm ${
                            message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
