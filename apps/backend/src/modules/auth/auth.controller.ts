import { Request, Response, NextFunction } from "express";
import { login } from "./auth.service";
import { LoginDTO } from "./auth.types";


export class AuthController{
    async login(request:Request, response:Response, next: NextFunction):Promise<void>{
        try {
            const dto = request.body as LoginDTO;
            const result = await login(dto);
            response.status(200).json ({
                success:true,
                data:result,
            });
        }catch (error){
            next(error);
        }
    }
}
