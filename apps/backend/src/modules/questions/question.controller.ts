import { QuestionsService } from "./questions.service";
import { db } from "@/config/database";
import { AppError } from "@/errors/AppError";

export class QuestionsController  {
    async createQuestion(request: any, response: any, next: any): Promise<void> {
        try{
            const questionsService = new QuestionsService();
            const question = await questionsService.createQuestion(request.body);
            response.status(201).json({success: true, data: question});
        }
        catch(error){
            next(error);
        }
}}
