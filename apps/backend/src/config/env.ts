import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV:  z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().nonempty(),
    PORT: z.coerce.number().int().positive().default(3333),
    ARGON2_MEMORY_COST: z.coerce.number().int().min(8192).default(65536),
    ARGON2_TIME_COST: z.coerce.number().int().min(1).default(3),
    ARGON2_PARALLELISM: z.coerce.number().int().min(1).default(1),
});

const env = envSchema.parse(process.env);

export {env};