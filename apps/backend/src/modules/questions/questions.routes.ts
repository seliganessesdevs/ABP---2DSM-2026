import { QuestionsController } from "./questions.controller";
import { NextFunction, Request, Response, Router } from "express";
import {z } from "zod";

const router = Router();
const controller = new QuestionsController();

const createQuestionSchema = z.object({
    requester_name: z.string().min(1),
    requester_email: z.string().email(),
    question: z.string().min(1),
    attachment_name: z.string().min(1).optional(),
    attachment_mime_type: z.string().min(1).optional(),
    attachment_data: z.string().min(1).optional(),
});

function validateCreateQuestion(req: Request, _res: Response, next: NextFunction) {
    try {
        req.body = createQuestionSchema.parse(req.body);
        next();
    } catch (error) {
        next(error); 
    }};


    router.post("/", validateCreateQuestion, (req, res, next) => controller.createQuestion(req, res, next));

    export default router;
