import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage, ChatNodeChild } from "../types/chatbot.types";
import { useChatNavigation } from "../hooks/useChatNavigation";
import mascotImg from "@/assets/login_jacare.png";
import { SatisfactionRating } from "./SatisfactionRating";

export function ChatWindow() {
  const { currentNode, isLoading, error, navigateTo } = useChatNavigation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastAppendedNodeId = useRef<number | null>(null);

  useEffect(() => {
    if (!currentNode || lastAppendedNodeId.current === currentNode.id) return;

    lastAppendedNodeId.current = currentNode.id;
    setMessages((prev) => [
      ...prev,
      {
        id: String(currentNode.id),
        sender: "bot",
        text: currentNode.prompt || currentNode.answer_summary || "",
        nodeId: currentNode.id,
        availableOptions: currentNode.children,
        navigationFlow:
          currentNode.id === 0
            ? [currentNode.slug]
            : [
                ...(prev[prev.length - 1]?.navigationFlow ?? []),
                currentNode.slug,
              ],
      },
    ]);
  }, [currentNode]);

  function handleOptionClick(child: ChatNodeChild, messageId: string) {
    setMessages((prev) => {
      const updated = prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              selectedOptionId: child.id,
            }
          : message,
      );

      return [
        ...updated,
        {
          id: `user-${messageId}-${child.id}`,
          sender: "user",
          text: child.title,
          nodeId: child.id,
        },
      ];
    });

    navigateTo(child.id);
  }

  const nodeTitle = currentNode?.title || "Início";

  if (error) {
    return (
      <div className="flex min-h-screen w-full h-full items-center justify-center bg-[#F1EDE2]">
        <span className="text-lg font-bold text-red-700">
          Erro ao carregar chatbot
        </span>
      </div>
    );
  }

  if (isLoading || !currentNode) {
    return (
      <div className="flex min-h-screen w-full h-full items-center justify-center bg-[#F1EDE2]">
        <span className="text-lg font-bold text-[#B20000]">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F1EDE2] p-5 md:p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B20000]">
            {nodeTitle}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <img
                  src={mascotImg}
                  alt="Mascote Caré"
                  className="mr-3 mt-1 h-18 w-18 shrink-0 rounded-full border bg-[#F1EDE2] p-1 object-contain"
                />
              )}

              <div className="max-w-xl rounded-2xl bg-[#FAFAFA] text-[#1f1f1f] shadow-md">
                <MessageBubble message={message} />

                {(message.availableOptions?.length ?? 0) > 0 &&
                  (() => {
                    const availableOptions = message.availableOptions ?? [];

                    return (
                      <div className="mt-2 flex flex-col gap-2 p-4">
                        <div className="mb-1">
                          <span className="rounded-xl bg-[#B20000] px-4 py-1 text-xs text-[#FAFAFA]">
                            Escolha uma opção
                          </span>
                        </div>

                        {availableOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              handleOptionClick(option, message.id)
                            }
                            disabled={message.selectedOptionId !== undefined}
                            className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                              message.selectedOptionId === option.id
                                ? "border-[#7D0000] bg-[#7D0000] text-white"
                                : "border-[#7D0000] bg-white text-[#7D0000]"
                            } ${
                              message.selectedOptionId !== undefined &&
                              message.selectedOptionId !== option.id
                                ? "cursor-default opacity-70"
                                : "cursor-pointer hover:bg-[#7D0000] hover:text-white"
                            }`}
                          >
                            {option.title}
                          </button>
                        ))}
                      </div>
                    );
                  })()}

                {message.sender === "bot" &&
                  message.nodeId !== undefined &&
                  message.nodeId !== 0 &&
                  (message.availableOptions?.length ?? 0) === 0 && (
                    <div className="px-4 pb-4">
                      <SatisfactionRating
                        navigation_flow={message.navigationFlow ?? []}
                        nodeId={message.nodeId}
                      />
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
