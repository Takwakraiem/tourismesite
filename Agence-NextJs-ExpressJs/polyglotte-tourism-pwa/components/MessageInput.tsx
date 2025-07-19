import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onFocus?: () => void; // ✅ ajouter ici
}

export function MessageInput({ input, setInput, onSend, onFocus }: MessageInputProps) {
  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <Textarea
          placeholder="Tapez votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={onFocus} // ✅ utiliser ici
          className="flex-1 min-h-[40px] max-h-[120px]"
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button disabled={!input.trim()} onClick={onSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
