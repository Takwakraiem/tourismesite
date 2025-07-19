"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import io from "socket.io-client";
import { Bell, MessageCircle, User, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Créer une instance socket globale
const socket = io("http://localhost:3500", {
  autoConnect: false,
});

interface HeaderProps {
  c: string;
}

type Message = {
  _id?: string;
  content: string;
  sender: string;
  userId: string;
  createdAt: string;
};

export function Header({ c }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [countryId, setCountryId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Gestion du pays
  useEffect(() => {
    if (c && c.trim() !== "") {
      setCountryId(c);
    } else {
      const storedId =
        typeof window !== "undefined"
          ? localStorage.getItem("selectedCountryId")
          : null;
      setCountryId(storedId ?? null);
    }
  }, [c]);

  // Initialiser Socket.IO et la logique de messages
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) return;

    // Décoder l'utilisateur courant
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id || payload._id;
    setCurrentUserId(userId);

    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    // Réception d’un nouveau message
    socket.on("newMessage", (message: Message) => {
      if (message.userId === userId) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, []);

  // Réinitialiser le compteur quand on est sur /messages
  useEffect(() => {
    if (pathname === "/messages") {
      setUnreadCount(0);
    }
  }, [pathname]);
  useEffect(() => {
    const handleResetUnread = () => {
      setUnreadCount(0);
    };
    window.addEventListener("resetUn", handleResetUnread);
    return () => {
      window.removeEventListener("resetUn", handleResetUnread);
    };
  }, []);

  const menuItems = [
    { label: "Home", href: `/home/${countryId ?? ""}` },
    { label: "Programs", href: `/programs/${countryId ?? ""}` },
    { label: "Guides", href: `/guides/${countryId ?? ""}` },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
  src="https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-1/299722290_720826189321112_5035228221426254928_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=9zp43uZ_GxEQ7kNvwFQ5ycI&_nc_oc=Adk3IETbcO4CM58a2D4iULyTtZewlcFCU9UfLP2WbQ6KThWmJXInERVQkI91q2VP-J4&_nc_zt=24&_nc_ht=scontent.ftun8-1.fna&_nc_gid=RubeL11Z72Wn1fPxQlzyeA&oh=00_AfQit9HQI69SyUwHxVbfAeDTDgknEvBtQYSBzgXc3uhleg&oe=687EF0D7" 
  alt="Profile Photo"
  width="63"
/>

           
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {currentUserId ? (
              <>
                {/* Messages */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/messages");
                    setUnreadCount(0);
                  }}
                  size="icon"
                  className="relative"
                >
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profil</DropdownMenuItem>
                    <DropdownMenuItem>Paramètres</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/countries");
                      }}
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="default" onClick={() => router.push("/login")}>
                Se connecter
              </Button>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
