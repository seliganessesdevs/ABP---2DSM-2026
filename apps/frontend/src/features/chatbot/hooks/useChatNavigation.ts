import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatbotApi } from "../api/chatbot.api";

const ROOT_SLUG = "root";

export function useChatNavigation() {
  const [currentNodeId, setCurrentNodeId] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [navigationFlow, setNavigationFlow] = useState<string[]>([ROOT_SLUG]);
  const [sessionLogId, setSessionLogId] = useState<number | null>(null);

  const {
    data: currentNode,
    isLoading,
    error,
  } = useQuery({
    queryKey:
      currentNodeId === null
        ? ["chatbot", "root"]
        : ["chatbot", "node", currentNodeId],
    queryFn: () =>
      currentNodeId === null
        ? chatbotApi.getRootNode()
        : chatbotApi.getNodeById(currentNodeId),
  });

  const navigateTo = useCallback(
    (nodeId: number, nodeSlug: string) => {
      setHistory((prev) =>
        currentNodeId !== null ? [...prev, currentNodeId] : prev,
      );
      setNavigationFlow((prev) => [...prev, nodeSlug]);
      setCurrentNodeId(nodeId);
    },
    [currentNodeId],
  );

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;

      const newHistory = [...prev];
      const lastNodeId = newHistory.pop()!;
      setCurrentNodeId(lastNodeId);
      return newHistory;
    });

    setNavigationFlow((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : prev,
    );
  }, []);

  const resetNavigation = useCallback(() => {
    setHistory([]);
    setCurrentNodeId(null);
    setNavigationFlow([ROOT_SLUG]);
    setSessionLogId(null);
  }, []);

  const goToRoot = useCallback(() => {
    setHistory((prev) =>
      currentNodeId !== null ? [...prev, currentNodeId] : prev,
    );
    setNavigationFlow((prev) => [...prev, ROOT_SLUG]);
    setCurrentNodeId(null);
  }, [currentNodeId]);

  const persistSessionLogId = useCallback((interactionLogId: number) => {
    setSessionLogId((prev) => prev ?? interactionLogId);
  }, []);

  const canGoBack = history.length > 0;

  return {
    currentNodeId,
    history,
    navigationFlow,
    sessionLogId,
    currentNode,
    isLoading,
    error,
    navigateTo,
    goBack,
    goToRoot,
    resetNavigation,
    canGoBack,
    persistSessionLogId,
  };
}
