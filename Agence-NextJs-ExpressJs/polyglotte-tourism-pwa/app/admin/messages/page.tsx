"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import socket from "@/lib/socket";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { UserSelect } from "@/components/UserSelect";
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
  email: string;
  country: string;
  createdAt: string;
  is_verified: boolean;
  role: string;
};
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>(
    {}
  );
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
useEffect(() => {
  localStorage.setItem("messageCounts", JSON.stringify(messageCounts));
}, [messageCounts]);
useEffect(() => {
  const storedCounts = localStorage.getItem("messageCounts");
  if (storedCounts) {
    setMessageCounts(JSON.parse(storedCounts));
  }
}, []);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    if (!token) return;
    socket.auth = { token };
    socket.connect();
    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      console.log(message);

      if (message.userId !== toUserId) {
        setMessageCounts((prev) => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1,
        }));
      }
    });
    socket.on("messageSent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("connect", () => {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(String(payload.id || payload._id));
    });
    return () => {
      socket.off("newMessage");
      socket.off("messageSent");
      socket.disconnect();
    };
  }, [token]);
  const [error, setError] = useState("");
  const Findall = async (storedToken: string) => {
    try {
      const res = await fetch("http://localhost:3500/api/findAllUSER", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la création.");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };
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
      setMessageCounts((prev) => ({
        ...prev,
        [receiverId]: 0, // reset le compteur
      }));
    } catch (error) {
      setError("Erreur lors du chargement des messages ");
    } finally {
      setIsLoadingMessages(false);
    }
  };
useEffect(() => {
  const handleReset = () => {
    if (toUserId) {
      setMessageCounts((prev) => ({
        ...prev,
        [toUserId]: 0,
      }));
    }
  };

  window.addEventListener("resetUnread", handleReset);
  return () => {
    window.removeEventListener("resetUnread", handleReset);
  };
}, [toUserId]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (token) {
      Findall(token);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div>
            <UserSelect
              users={users}
              selectedUserId={toUserId}
              onChange={(id) => {
                setToUserId(id);
                fetchMessages(id);
              }}
              messageCounts={messageCounts}
            />
          </div>
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
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>

              <MessageInput
                input={input}
                setInput={setInput}
                onSend={sendMessage}
                 onFocus={() => {
    window.dispatchEvent(new Event("resetUnread"));
  }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
