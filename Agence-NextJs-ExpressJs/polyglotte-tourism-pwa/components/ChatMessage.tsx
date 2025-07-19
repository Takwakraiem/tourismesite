import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
type Message = {
  _id?: string;
  content: string;
  sender: string;
  userId: string;
  createdAt: string;
};
interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
          isOwn ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <Avatar className="w-8 h-8">
           <AvatarImage src={isOwn ? "/user.avif" : "/user1.png"} />
          <AvatarFallback>{isOwn ? "M" : "A"}</AvatarFallback>
        </Avatar>
        <div className={`rounded-lg p-3 ${isOwn ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
            {new Date(message.createdAt).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
