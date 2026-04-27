import {useState, useCallback} from "react";
import { useQuery } from "@tanstack/react-query";
import { chatbotApi } from "../api/chatbot.api";
import type { ChatNode } from "../types/chatbot.types";

export function useChatNavigation(){
    const [currentNodeId, setCurrentNodeId] = useState<number | null>(null);
    const [history, setHistory] = useState<number[]>([]);

    const {
        data: currentNode,
        isLoading,
        error,
    } = useQuery({
        queryKey: currentNodeId === null
        ? ["chatbot", "root"]
        : ["chatbot", "node", currentNodeId],
        queryFn: () =>
            currentNodeId === null
            ? chatbotApi.getRootNode()
            : chatbotApi.getNodeById(currentNodeId),
    });
    
        const navigateTo = useCallback((nodeId: number) => {
            setHistory((prev) => (currentNodeId !== null ? [...prev, currentNodeId] : prev));
            setCurrentNodeId(nodeId);
        }, [currentNodeId]);

        const goBack = useCallback(() => {
            setHistory((prev) => {
                if (prev.length === 0) return prev;
                const newHistory = [...prev];
                const lastNodeId = newHistory.pop()!;
                setCurrentNodeId(lastNodeId);
                return newHistory;
            });
            }, []);

        const resetNavigation = useCallback(() => {
            setHistory([]);
            setCurrentNodeId(null);
            }, []);

        const canGoBack = history.length > 0;

    return {
        currentNodeId,
        history,
        currentNode,
        isLoading,
        error,
        navigateTo,
        goBack,
        resetNavigation,
        canGoBack
    };
}

