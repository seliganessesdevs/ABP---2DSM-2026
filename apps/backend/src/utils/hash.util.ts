import { hash, verify } from "argon2";
import {env} from "../config/env";

export async function hashPassword(plainPassword: string): Promise<string> {
      return await hash(plainPassword, {
            type: 2, // Argon2id
            memoryCost: env.ARGON2_MEMORY_COST,
            timeCost: env.ARGON2_TIME_COST,
            parallelism: env.ARGON2_PARALLELISM,
      });
}

export async function comparePassword(plainPassword: string, hash: string): Promise<boolean> {
      return await verify(hash, plainPassword);
}