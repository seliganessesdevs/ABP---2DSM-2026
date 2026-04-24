export interface CreateQuestionDTO {
  requester_name: string;
  question: string;
  requester_email: string;
  attachment_name?: string | null;
  attachment_mime_type?: string | null;
  attachment_data?: Buffer | null;
}

export interface UpdateQuestionStatusDTO {
  status: "ABERTA" | "RESPONDIDA";
}

export interface QuestionResponseDTO {
  id: number;
  requester_name: string;
  question: string;
  requester_email: string;
  status: "ABERTA" | "RESPONDIDA";
  created_at: string;
  updated_at: string;
}