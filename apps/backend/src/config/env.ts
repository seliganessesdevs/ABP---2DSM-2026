import { z } from "zod";

const envSchema = z.object({
    NODE_ENV:  z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().nonempty(),
    PORT: z.coerce.number().int().positive().default(3333)
});

const env = envSchema.parse(process.env);

export {env};