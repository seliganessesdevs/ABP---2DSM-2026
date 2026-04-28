import { useMutation } from "@tanstack/react-query";
import { chatbotApi } from "../api/chatbot.api";
import type { QuestionFormData, QuestionPayload } from "../types/chatbot.types";

export function useSubmitQuestion() {
  return useMutation({
    mutationFn: async (formData: QuestionFormData) => {
      const data = new FormData();
      data.append("requester_name", formData.requester_name);
      data.append("requester_email", formData.requester_email);
      data.append("question", formData.question);
      
      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      return chatbotApi.submitQuestion(data);
    },
    onSuccess: (data: QuestionPayload) => {
      // Optionally invalidate queries here if needed
      console.log("Question submitted successfully:", data);
    },
    onError: (error: Error) => {
      console.error("Failed to submit question:", error.message);
    },
  });
}
