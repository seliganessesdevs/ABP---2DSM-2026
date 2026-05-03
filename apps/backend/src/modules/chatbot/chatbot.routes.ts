import {Request, Response, NextFunction, Router} from 'express';
import {ChatbotController} from './chatbot.controller';
import {z} from 'zod';

const router = Router();
const controller = new ChatbotController();

const interactionLogSchema = z.object({
  navigation_flow: z.array(z.string().min(1)).min(1),
  flag: z.enum(["ATENDEU", "NAO_ATENDEU"]),
  node_id: z.number().int().positive(),
  session_log_id: z.number().int().positive().optional(),
});

function validateInteractionLog(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = interactionLogSchema.parse(req.body);
    next();
  } catch (error) {
    next(error); 
  }
}


router.get('/nodes/root', (req, res, next) => controller.getRootNode(req, res, next));
router.get('/nodes/:id', (req, res, next) => controller.getNodeById(req, res, next));
router.post('/sessions/log', validateInteractionLog, (req, res, next) => controller.createInteractionLog(req, res, next));

export default router;
