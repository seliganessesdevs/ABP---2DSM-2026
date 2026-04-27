import { PrismaPg } from "@prisma/adapter-pg";
import * as prisma from "@prisma/client";
import { Pool } from "pg";

import { env } from "./env";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new prisma.PrismaClient({ adapter });

export { db };
