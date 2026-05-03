import { QuestionsService } from "./questions.service";

export class QuestionsController  {
    async createQuestion(request: any, response: any, next: any): Promise<void> {
        try{
            const questionsService = new QuestionsService();
            const question = await questionsService.createQuestion({
                ...request.body,
                attachment_data: request.body.attachment_data
                    ? (Uint8Array.from(
                        Buffer.from(request.body.attachment_data, "base64"),
                    ) as Uint8Array<ArrayBuffer>)
                    : null,
            });
            response.status(201).json({success: true, data: question});
        }
        catch(error){
            next(error);
        }
}}
