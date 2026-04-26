import { Router, Request, Response, NextFunction } from "express";
import {z} from "zod";
import { AuthController } from "./auth.controller";


const router = Router();
const controller = new AuthController();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

function validateLogin(req: Request,_res: Response,next: NextFunction):void{
    try{
        req.body = loginSchema.parse(req.body);
        next();
         } catch (error){
            next(error);
         }
}

router.post("/login", validateLogin, (req, res,next)=> controller.login(req, res, next),);
export default router;