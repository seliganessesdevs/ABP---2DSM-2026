import { Request, Response, NextFunction } from 'express';
import { ChatbotService } from './chatbot.service';
import { CreateInteractionLogDTO } from './chatbot.types'; 

export class ChatbotController {
    async getRootNode(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const chatbotService = new ChatbotService();
            const rootNode = await chatbotService.getRootNode();
            response.status(200).json({ success: true, data: rootNode });
        } catch (error) {
            next(error);
        }
    }

    async getNodeById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = request.params;
            const chatbotService = new ChatbotService();
            const node = await chatbotService.getNodeById(Number(id));
            response.status(200).json({ success: true, data: node });
        } catch (error) {
            next(error);
        }
    }

    async createInteractionLog(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { navigation_flow, node_id, flag } = request.body as CreateInteractionLogDTO;
            const chatbotService = new ChatbotService();
            const result = await chatbotService.createInteractionLog({ navigation_flow, node_id, flag });
            response.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}
