import { AppError } from "../../errors/AppError";
import { db } from '../../config/database';
import { LoginDTO, LoginResponse } from "./auth.types";
import { generateToken } from "../../utils/jwt.utils";
import { comparePassword } from "../../utils/hash.util";

export async function login(dto: LoginDTO): Promise<LoginResponse> {
      const user = await db.user.findUnique({
            where: { email: dto.email },
      });

      const isPasswordValid = await comparePassword(dto.password, user.password_hash);

      if (!isPasswordValid) {
            throw new AppError("Credenciais inválidas", 401);
      }

      const token = generateToken({ sub: user.id.toString(), role: user.role });

      return {
            token,
            user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
            },
      };
}