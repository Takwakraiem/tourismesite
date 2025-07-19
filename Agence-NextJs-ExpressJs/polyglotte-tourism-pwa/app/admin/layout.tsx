"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MapPin, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { io } from "socket.io-client";
import clsx from "clsx";

const socket = io("http://localhost:3500", {
  autoConnect: false,
});

type Message = {
  _id?: string;
  content: string;
  sender: string;
  userId: string;
  createdAt: string;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id || payload._id;
    setCurrentUserId(userId);

    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    socket.on("newMessage", (message: Message) => {
      if (message.userId === userId && message.sender !== userId) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pathname === "/admin/messages") {
      setUnreadCount(0);
    }
  }, [pathname]);
  useEffect(() => {
    const handleResetUnread = () => {
      setUnreadCount(0);
    };
    window.addEventListener("resetUnread", handleResetUnread);
    return () => {
      window.removeEventListener("resetUnread", handleResetUnread);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo & titre */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Dashboard Admin
              </h1>
              <p className="text-sm text-gray-600">Polyglotte Tourism</p>
            </div>
          </div>

          {/* Avatar + Notifications */}
          <div className="flex items-center space-x-4 relative">
            {/* Notification Badge */}

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition">
                  <AvatarImage src="/user1.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t bg-white">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap justify-center items-center gap-2">
              {[
                { label: "Vue d'ensemble", href: "/admin" },
                { label: "Utilisateurs", href: "/admin/users" },
                { label: "Pays", href: "/admin/countries" },
                { label: "Programmes", href: "/admin/programs" },
                { label: "Guides", href: "/admin/guides" },
                { label: "Messages", href: "/admin/messages" },
                { label: "ProgramGuide", href: "/admin/programguide" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "text-center py-1 px-3 rounded-md font-medium transition hover:bg-blue-100 hover:text-blue-600",
                    pathname === item.href && "bg-blue-100 text-blue-700"
                  )}
                >
                  {item.label}
                  {item.label === "Messages" && unreadCount > 0 && (
                    <Badge className="ml-1 text-xs bg-red-600 hover:bg-red-600">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
