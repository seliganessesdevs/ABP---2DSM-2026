import { useEffect, useRef, useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { MessageBubble } from "./MessageBubble";
import type {
  ChatMessage,
  ChatNodeChild,
  ChatSidebarHistoryItem,
} from "../types/chatbot.types";
import { useChatNavigation } from "../hooks/useChatNavigation";
import mascotImg from "@/assets/login_jacare.png";
import { SatisfactionRating } from "./SatisfactionRating";

export function ChatWindow() {
  const {
    currentNode,
    isLoading,
    error,
    navigateTo,
    goBack,
    canGoBack,
    navigationFlow,
    goToRoot,
    sessionLogId,
    persistSessionLogId,
  } = useChatNavigation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastAppendedFlowLength = useRef(0);
  const messageCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageElementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isInitialLoading = isLoading && messages.length === 0;

  function createMessageId(prefix: "bot" | "user") {
    messageCounter.current += 1;
    return `${prefix}-${messageCounter.current}`;
  }

  useEffect(() => {
    if (!currentNode || navigationFlow.length === 0) return;
    if (lastAppendedFlowLength.current === navigationFlow.length) return;

    lastAppendedFlowLength.current = navigationFlow.length;

    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId("bot"),
        sender: "bot",
        text: currentNode.prompt || currentNode.answer_summary || "",
        nodeId: currentNode.id,
        nodeTitle: currentNode.title,
        availableOptions: currentNode.children,
        navigationFlow: [...navigationFlow],
      },
    ]);
  }, [currentNode, navigationFlow]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  const historyItems = messages.reduce<ChatSidebarHistoryItem[]>(
    (items, message) => {
      if (message.sender !== "bot" || !message.nodeId || message.nodeId === 0) {
        return items;
      }

      const label =
        message.nodeTitle ??
        message.navigationFlow?.at(-1)?.replaceAll("-", " ") ??
        "Pergunta";

      const previousItem = items.at(-1);

      if (previousItem?.label === label) {
        return items;
      }

      return [
        ...items,
        {
          id: `history-${message.id}`,
          label,
          messageId: message.id,
        },
      ];
    },
    [],
  );
  const latestBotMessage = [...messages]
    .reverse()
    .find((message) => message.sender === "bot");

  function handleHistoryItemClick(messageId: string) {
    messageElementRefs.current[messageId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

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
          id: createMessageId("user"),
          sender: "user",
          text: child.title,
          nodeId: child.id,
        },
      ];
    });

    navigateTo(child.id, child.slug);
  }

  function handleReturnToRoot() {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId("user"),
        sender: "user",
        text: "Ver outras perguntas",
        nodeId: 0,
      },
    ]);

    goToRoot();
  }

  function handleGoBack() {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId("user"),
        sender: "user",
        text: "Voltar para a pergunta anterior",
      },
    ]);

    goBack();
  }

  const nodeTitle = currentNode?.title || "Inicio";

  if (error) {
    return (
      <div className="flex min-h-screen h-full w-full items-center justify-center bg-[#F1EDE2]">
        <span className="text-lg font-bold text-red-700">
          Erro ao carregar chatbot
        </span>
      </div>
    );
  }

  if (isInitialLoading || (!currentNode && messages.length === 0)) {
    return (
      <div className="flex min-h-screen h-full w-full items-center justify-center bg-[#F1EDE2]">
        <span className="text-lg font-bold text-[#B20000]">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F1EDE2] lg:h-screen lg:overflow-hidden lg:p-4">
      <div className="flex min-h-screen w-full flex-col gap-6 lg:h-full lg:min-h-0 lg:flex-row lg:gap-4">
        <div className="w-full lg:h-full lg:w-[360px] lg:flex-shrink-0 xl:w-[380px]">
          <ChatSidebar
            historyItems={historyItems}
            onHistoryItemClick={handleHistoryItemClick}
          />
        </div>

        <div className="min-w-0 flex-1 rounded-[28px] bg-[#EEE7D8] p-5 shadow-[0_20px_50px_rgba(92,53,12,0.08)] md:p-7 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B20000]">
              {nodeTitle}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                ref={(element) => {
                  messageElementRefs.current[message.id] = element;
                }}
                className={`flex w-full ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <img
                    src={mascotImg}
                    alt="Mascote Care"
                    className="mr-3 mt-1 h-18 w-18 shrink-0 rounded-full border bg-[#F1EDE2] p-1 object-contain"
                  />
                )}

                <div className="max-w-xl rounded-2xl bg-[#FAFAFA] text-[#1f1f1f] shadow-md">
                  <MessageBubble message={message} />

                  {(message.availableOptions?.length ?? 0) > 0 && (
                    <div className="mt-2 flex flex-col gap-2 p-4">
                      <div className="mb-1">
                        <span className="rounded-xl bg-[#B20000] px-4 py-1 text-xs text-[#FAFAFA]">
                          Escolha uma opcao
                        </span>
                      </div>

                      {(message.availableOptions ?? []).map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleOptionClick(option, message.id)}
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

                      {message.id === latestBotMessage?.id &&
                        message.nodeId !== 0 &&
                        canGoBack && (
                          <button
                            type="button"
                            onClick={handleGoBack}
                            className="mt-2 cursor-pointer rounded-xl border-2 border-[#A89A82] bg-[#F8F4EC] px-4 py-2 text-sm font-semibold text-[#6E6252] transition-colors hover:bg-[#E9E0D0]"
                          >
                            Voltar para a pergunta anterior
                          </button>
                        )}
                    </div>
                  )}

                  {message.sender === "bot" &&
                    message.nodeId !== undefined &&
                    message.nodeId !== 0 &&
                    (message.availableOptions?.length ?? 0) === 0 && (
                      <div className="flex flex-col gap-3 px-4 pb-4">
                        <SatisfactionRating
                          navigation_flow={message.navigationFlow ?? []}
                          nodeId={message.nodeId}
                          sessionLogId={sessionLogId}
                          onSessionPersisted={persistSessionLogId}
                        />

                        <button
                          type="button"
                          onClick={handleGoBack}
                          className="cursor-pointer rounded-xl border-2 border-[#A89A82] bg-[#F8F4EC] px-4 py-2 text-sm font-semibold text-[#6E6252] transition-colors hover:bg-[#E9E0D0]"
                        >
                          Voltar para a pergunta anterior
                        </button>

                        <button
                          type="button"
                          onClick={handleReturnToRoot}
                          className="cursor-pointer rounded-xl border-2 border-[#7D0000] bg-white px-4 py-2 text-sm font-semibold text-[#7D0000] transition-colors hover:bg-[#7D0000] hover:text-white"
                        >
                          Voltar ao inicio
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}

            {isLoading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#7D0000] shadow-md">
                  Carregando proxima resposta...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
