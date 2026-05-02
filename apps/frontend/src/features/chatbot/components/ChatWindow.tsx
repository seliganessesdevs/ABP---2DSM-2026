import { useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "../types/chatbot.types";
import { OptionButton } from "./OptionButton";
import type { ChatNodeChild } from "../types/chatbot.types";
import { EvidenceCard } from "./EvidenceCard";
import { useChatNavigation } from "../hooks/useChatNavigation";

export function ChatWindow() {
  // Usa o hook real para navegação
  const {
    currentNode,
    isLoading,
    error,
    navigateTo,
    canGoBack,
    goBack,
  } = useChatNavigation();

  // Histórico de mensagens (UI)
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Atualiza o histórico quando o nó muda
  useEffect(() => {
    if (!currentNode) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(currentNode.id),
        sender: "bot",
        text: currentNode.prompt || "",
        nodeId: currentNode.id,
      },
    ]);
  }, [currentNode]);

  // Handler para clique em opção
  function handleOptionClick(child: ChatNodeChild) {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${child.id}`,
        sender: "user",
        text: child.title,
        nodeId: child.id,
      },
    ]);
    navigateTo(child.id);
  }

  // Badge do nó atual
  const nodeTitle = currentNode?.title || "Início";

  // --- Loading/Error handling ---
  if (isLoading || !currentNode) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F1EDE2] w-full h-full">
        <span className="text-[#B20000] font-bold text-lg">Carregando...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F1EDE2] w-full h-full">
        <span className="text-red-700 font-bold text-lg">Erro ao carregar chatbot</span>
      </div>
    );
  }

  // --- Main render ---
  return (
    // container geral do chat
    <div className="flex justify-center items-center min-h-screen bg-[#F1EDE2] w-full h-full p-5">
      <div className="flex flex-col gap-12 w-full h-full ">
        {/* Mensagem do bot (card branco com avatar fora) */}
        <div className="flex items-start">
          {/* Avatar do jacaré */}
          <img src="/iconchat.png" alt="Mascote Caré" className="w-24 h-24 mr-3 rounded-full border self-start" />
          {/* Card branco */}
          <div className="bg-[#FAFAFA] rounded-xl shadow-md p-4 w-full max-w-lg mr-auto">
            {/* Badge do nó atual */}
            <div className="flex items-center mb-4">
              <span className="text-[#FAFAFA] bg-[#B20000] px-6 py-1 rounded-xl text-xs">
                {nodeTitle}
              </span>
            </div>
            {/* Mensagem do bot */}
            <MessageBubble message={messages[0]} />
            {/* Opções */}
            {currentNode.children.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                {currentNode.children.map((child) => (
                  <OptionButton
                    key={child.id}
                    child={child}
                    onClick={() => handleOptionClick(child)}
                    disabled={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Mensagens do usuário (fora do card, alinhadas à direita) */}
        {messages
          .filter((msg) => msg.sender === "user")
          .map((msg) => (
            <div key={msg.id} className="flex justify-end w-full ">
              <div className="bg-[#FAFAFA] rounded-xl shadow-md p-4 text-white font-bold max-w-lg ml-auto">
                <MessageBubble message={msg} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}