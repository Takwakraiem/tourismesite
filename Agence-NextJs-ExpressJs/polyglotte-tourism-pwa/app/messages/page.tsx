"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";

type Message = {
  _id?: string;
  content: string;
  sender: string;
  userId: string;
  createdAt: string;
};

type User = {
  _id: string;
  name: string;
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
 const messagesEnd = useRef<HTMLDivElement>(null);
   useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: "instant" });
  };
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
     
    });

    socket.on("messageSent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("connect", () => {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.id || payload._id);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageSent");
      socket.disconnect();
    };
  }, [token]);
  const fetchMessages = async (receiverId: string) => {
    setIsLoadingMessages(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `http://localhost:3500/api/messages/${receiverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: Message[] = await res.json();
      setMessages(data);
      console.log(data);
      
    } catch (error) {
      console.error("Erreur lors du chargement des messages :", error);
     } finally {
      setIsLoadingMessages(false);
    }
  };



  const GetUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3500/api/findbyrole", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: User = await res.json();
      setToUserId(data._id);
      setCurrentUserId(data._id)
      await fetchMessages(data._id);
    } catch (error) {
      console.error("Erreur lors de la récupération du destinataire :", error);
    }
  };

  useEffect(() => {
    if (token) GetUser();
  }, [token]);

  const sendMessage = () => {
    if (input.trim() === "" || !toUserId) return;

    socket.emit("sendMessage", {
      content: input,
      toUserId,
    });

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header c=""  />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/user.avif?height=40&width=40" />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Support Polyglotte</h1>
              <p className="text-sm text-green-600">En ligne</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Conversation</CardTitle>
              </CardHeader>
              
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {!toUserId ? (
                  <p className="text-gray-500 text-center mt-10">
                    Aucun utilisateur sélectionné
                  </p>
                ) : isLoadingMessages ? (
                  <p className="text-gray-500 text-center mt-10">
                    Chargement des messages...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">
                    Aucun message disponible
                  </p>
                ) : (
                  <>
                   
                    <MessageList
                      messages={messages}
                      currentUserId={currentUserId}
                    />
                     <div ref={messagesEnd} />
                  </>
                )}
              </CardContent>

              <MessageInput
                input={input}
                setInput={setInput}
                onSend={sendMessage}
                 onFocus={() => {
    window.dispatchEvent(new Event("resetUn"));
  }}
              />
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">+216 70 123 456</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">
                      contact@polyglotte.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">
                    Comment réserver un programme ?
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Cliquez sur "Réserver" sur la page du programme
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">
                    Puis-je annuler ma réservation ?
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Oui, jusqu'à 48h avant le départ
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">
                    Les guides parlent français ?
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Tous nos guides sont francophones
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

     
    </div>
  );
}
