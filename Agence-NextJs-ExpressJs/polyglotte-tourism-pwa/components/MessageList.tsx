import { ChatMessage } from "./ChatMessage";
type Message = {
  _id?: string;
  content: string;
  sender: string;
  userId: string;
  createdAt: string;
};
interface MessageListProps {
  messages: Message[];
  currentUserId: string | null;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return <p className="text-center text-sm text-gray-500">Aucun message pour le moment.</p>;
  }

  return (
    <>
      {messages.map((msg) => (
        <ChatMessage key={msg._id} message={msg} isOwn={msg.sender === currentUserId} />
      ))}
    </>
  );
}
