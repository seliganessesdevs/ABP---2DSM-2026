import { useMutation } from "@tanstack/react-query";
import { chatbotApi } from "../api/chatbot.api";
import type {
  QuestionFormData,
  QuestionPayload,
  SubmitQuestionPayload,
} from "../types/chatbot.types";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Nao foi possivel ler o anexo."));
        return;
      }

      const [, base64Content = ""] = result.split(",");
      resolve(base64Content);
    };

    reader.onerror = () => reject(new Error("Nao foi possivel ler o anexo."));
    reader.readAsDataURL(file);
  });
}

export function useSubmitQuestion() {
  return useMutation({
    mutationFn: async (formData: QuestionFormData) => {
      const payload: SubmitQuestionPayload = {
        requester_name: formData.requester_name,
        requester_email: formData.requester_email,
        question: formData.question,
      };

      if (formData.attachment) {
        payload.attachment_name = formData.attachment.name;
        payload.attachment_mime_type = formData.attachment.type;
        payload.attachment_data = await fileToBase64(formData.attachment);
      }

      return chatbotApi.submitQuestion(payload);
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
