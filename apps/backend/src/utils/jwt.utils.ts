import { sign, verify, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(payload: { sub: string; role: string }): string {
      const options: SignOptions = {
            expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      };
      return sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): { sub: string; role: string; iat: number; exp: number } {
      return verify(token, env.JWT_SECRET) as { sub: string; role: string; iat: number; exp: number };
}