import { CreateQuestionDTO,QuestionResponseDTO, UpdateQuestionStatusDTO } from "./questions.types";
import { db } from "../../config/database";
import { AppError } from "../../errors/AppError";

export class QuestionsService {
    async createQuestion(dto: CreateQuestionDTO): Promise<QuestionResponseDTO> {
        const question = await db.question.create({
            data:{
                requester_name: dto.requester_name,
                question: dto.question,
                requester_email: dto.requester_email,
                attachment_name: dto.attachment_name || null,
                attachment_mime_type: dto.attachment_mime_type || null,
                attachment_data: dto.attachment_data || null,
                status: "ABERTA"
            }
        })
        return {
            id: question.id,
            requester_name: question.requester_name,
            question: question.question,
            requester_email: question.requester_email,
            status: question.status,
            created_at: question.created_at.toISOString(),
            updated_at: question.updated_at.toISOString()
        };
    }

    async listQuestions(): Promise<void> {
        throw new AppError("Not implemented", 501);
    }

    async updateStatus(): Promise<void> {
        throw new AppError("Not implemented", 501);
    }
}
