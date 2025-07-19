"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type User = {
  _id: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
  is_verified: boolean;
  role: string;
};

interface UserSelectProps {
  users: User[];
  selectedUserId: string;
  onChange: (id: string) => void;
  messageCounts: Record<string, number>;
  
}

export function UserSelect({
  users,
  selectedUserId,
  onChange,
  messageCounts,
}: UserSelectProps) {
  console.log(  users,
  selectedUserId,
  onChange,
  messageCounts);
  
  return (
    <ScrollArea className="h-[500px] pr-2">
      <div className="space-y-3">
        {users.map((user) => (
          <Card
            key={user._id}
              onClick={() => {
    onChange(user._id);
    window.dispatchEvent(new Event("resetUnread")); 
  }}
            className={`cursor-pointer transition-shadow hover:shadow-md p-4 border ${
              user._id === selectedUserId
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {messageCounts[user._id] > 0 && (
                <span className="bg-red-500 animate-pulse text-white text-xs rounded-full px-2 py-0.5">
                  {messageCounts[user._id]}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
