// Bolha de mensagem do bot/usuário
import type { ChatMessage } from "../types/chatbot.types";

interface MessageBubbleProps {
  message: ChatMessage;
}
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  return (
        <div className={`rounded-xl px-6 py-3 font-bold break-words ${isUser ? "bg-[#B20000] text-white text-right" : "bg-[#FAFAFA] text-left"}`}>
          {message.text}
        </div>
  );
}
