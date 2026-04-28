// Botões de opções para o usuário escolher
import { Button } from "@/components/ui/button";
import type { ChatNodeChild } from "../types/chatbot.types";

interface OptionButtonProps {
  child: ChatNodeChild;
  onClick: (id: number) => void;
  disabled?: boolean;
}

export function OptionButton({ child, onClick, disabled }: OptionButtonProps) {
  return (
    <Button
      variant="default"
      className="rounded-x px-6 py-3 font-bold break-words bg-white text-[#B20000] border-2 border-[#B20000] hover:bg-[#B20000] hover:text-white disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
      onClick={() => onClick(child.id)}
      disabled={disabled}
    >
      {child.title}
    </Button>
  );
}