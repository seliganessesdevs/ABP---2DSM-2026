import { QuestionsController } from "./questions.controller";
import { Router } from "express";
import {z } from "zod";

const router = Router();
const controller = new QuestionsController();

const createQuestionSchema = z.object({
    requester_name: z.string().min(1),
    requester_email: z.string().email(),
    question: z.string().min(1),
});

function validateCreateQuestion(req, res, next) {
    try {
        req.body = createQuestionSchema.parse(req.body);
        next();
    } catch (error) {
        next(error); 
    }};


    router.post("/", validateCreateQuestion, (req, res, next) => controller.createQuestion(req, res, next));

    export default router;