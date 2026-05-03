// Bolha de mensagem do bot/usuário
import type { ChatMessage } from "../types/chatbot.types";

interface MessageBubbleProps {
  message: ChatMessage;
}

function normalizeMessageText(text: string): string {
  if (!text) return "";

  const withLineBreaks = text
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(div|p|li|ul|ol|h[1-6])\s*>/gi, "\n");

  const stripped = withLineBreaks.replace(/<[^>]+>/g, "");

  return stripped
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const text = normalizeMessageText(message.text);

  return (
    <div
      className={`rounded-xl px-6 py-3 font-bold wrap-break-word whitespace-pre-line ${isUser ? "bg-[#B20000] text-white text-right" : "bg-[#FAFAFA] text-left"}`}
    >
      {text}
    </div>
  );
}
