import { api } from "@/lib/axios";
import type {
    ChatNode,
    SessionRatingPayload,
    SessionRatingResponse,
    QuestionPayload,
    SubmitQuestionPayload,
} from "../types/chatbot.types";
import type { ApiResponse } from "@/types/api.types";


export async function getRootNode(){
    const res = await api.get<ApiResponse<ChatNode>>("/nodes/root");
    return res.data.data;
}

export async function getNodeById(id: number){
    const res = await api.get<ApiResponse<ChatNode>>(`/nodes/${id}`);
    return res.data.data;
}

export async function submitRating(payload: SessionRatingPayload){
    const res = await api.post<ApiResponse<SessionRatingResponse>>("/sessions/log", payload);
    return res.data.data
}

export async function submitQuestion(payload: SubmitQuestionPayload){
    const res = await api.post<ApiResponse<QuestionPayload>>("/questions", payload);
    return res.data.data;
}

export const chatbotApi = {
    getRootNode,
    getNodeById,
    submitRating,
    submitQuestion
};
