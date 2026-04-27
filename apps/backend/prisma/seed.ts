import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { Pool } from "pg";

type LegacyNodeSeed = {
  parentSlug: string | null;
  title: string;
  slug: string;
  prompt: string | null;
  answerSummary: string | null;
  evidenceExcerpt: string | null;
  evidenceSource: string | null;
  displayOrder: number;
  isActive: boolean;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL não definida. Configure o arquivo .env antes de executar o seed.",
  );
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY_SQL_SEED_PATH = path.join(
  __dirname,
  "migrations",
  "20260404001330_init",
  "02_seed.sql",
);

const USER_SEEDS = [
  {
    name: "Administrador",
    email: "admin@fatec.sp.gov.br",
    password: "Admin@123",
    role: "ADMIN",
  },
  {
    name: "Secretaria Acadêmica",
    email: "secretaria@fatec.sp.gov.br",
    password: "Secretaria@123",
    role: "SECRETARIA",
  },
] as const;

const TG_TCC_SLUG_OVERRIDES = new Map<string, string>([
  ["dsm|Trabalho de Graduação (TG/TCC)|dsm-portfolio", "dsm-tg-tcc"],
  ["geo|Trabalho de Graduação (TG/TCC)|geo-portfolio", "geo-tg-tcc"],
  ["marh|Trabalho de Graduação (TG/TCC)|marh-portfolio", "marh-tg-tcc"],
]);

const DEACTIVATE_SLUGS = [
  "dsm-dispensa-extensao",
  "geo-dispensa-extensao",
  "marh-dispensa-extensao",
];

const ARGON2_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

function extractLegacySeedCalls(sql: string): string[] {
  const marker = "SELECT upsert_navigation_node(";
  const calls: string[] = [];

  let cursor = 0;
  while (cursor < sql.length) {
    const start = sql.indexOf(marker, cursor);
    if (start === -1) {
      break;
    }

    const argsStart = start + marker.length;
    let i = argsStart;
    let depth = 1;
    let inSingleQuote = false;
    let inDollarQuote: string | null = null;
    let closed = false;

    while (i < sql.length) {
      const char = sql[i];

      if (inDollarQuote) {
        if (sql.startsWith(inDollarQuote, i)) {
          i += inDollarQuote.length;
          inDollarQuote = null;
          continue;
        }
        i += 1;
        continue;
      }

      if (inSingleQuote) {
        if (char === "'" && sql[i + 1] === "'") {
          i += 2;
          continue;
        }

        if (char === "'") {
          inSingleQuote = false;
        }

        i += 1;
        continue;
      }

      if (char === "$") {
        let end = i + 1;
        while (end < sql.length && /[A-Za-z0-9_]/.test(sql[end])) {
          end += 1;
        }

        if (end < sql.length && sql[end] === "$") {
          inDollarQuote = sql.slice(i, end + 1);
          i = end + 1;
          continue;
        }
      }

      if (char === "'") {
        inSingleQuote = true;
        i += 1;
        continue;
      }

      if (char === "(") {
        depth += 1;
        i += 1;
        continue;
      }

      if (char === ")") {
        depth -= 1;
        if (depth === 0) {
          const args = sql.slice(argsStart, i);
          calls.push(args);

          const semicolonIndex = sql.indexOf(";", i);
          cursor = semicolonIndex === -1 ? i + 1 : semicolonIndex + 1;
          closed = true;
          break;
        }
      }

      i += 1;
    }

    if (!closed) {
      throw new Error(
        "Não foi possível encontrar o fechamento de uma chamada upsert_navigation_node no seed legado.",
      );
    }
  }

  if (calls.length === 0) {
    throw new Error(
      "Nenhuma chamada de upsert_navigation_node foi encontrada no seed legado.",
    );
  }

  return calls;
}

function splitTopLevelArgs(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDollarQuote: string | null = null;
  let parenthesisDepth = 0;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    if (inDollarQuote) {
      if (value.startsWith(inDollarQuote, i)) {
        current += inDollarQuote;
        i += inDollarQuote.length - 1;
        inDollarQuote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (inSingleQuote) {
      current += char;

      if (char === "'" && value[i + 1] === "'") {
        current += "'";
        i += 1;
        continue;
      }

      if (char === "'") {
        inSingleQuote = false;
      }
      continue;
    }

    if (char === "$") {
      let end = i + 1;
      while (end < value.length && /[A-Za-z0-9_]/.test(value[end])) {
        end += 1;
      }

      if (end < value.length && value[end] === "$") {
        const delimiter = value.slice(i, end + 1);
        inDollarQuote = delimiter;
        current += delimiter;
        i = end;
        continue;
      }
    }

    if (char === "'") {
      inSingleQuote = true;
      current += char;
      continue;
    }

    if (char === "(") {
      parenthesisDepth += 1;
      current += char;
      continue;
    }

    if (char === ")") {
      parenthesisDepth -= 1;
      current += char;
      continue;
    }

    if (char === "," && parenthesisDepth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function parseSqlLiteral(input: string): string | number | boolean | null {
  const value = input.trim();

  if (/^NULL$/i.test(value)) {
    return null;
  }

  if (/^TRUE$/i.test(value)) {
    return true;
  }

  if (/^FALSE$/i.test(value)) {
    return false;
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  if (value.startsWith("$$") && value.endsWith("$$")) {
    return value.slice(2, -2);
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }

  throw new Error(`Literal SQL não suportado no parser: ${value.slice(0, 80)}`);
}

function parseLegacyNodeSeed(callArgs: string): LegacyNodeSeed {
  const args = splitTopLevelArgs(callArgs).map(parseSqlLiteral);

  if (args.length !== 9) {
    throw new Error(
      `Esperados 9 argumentos no upsert_navigation_node; recebido ${args.length}.`,
    );
  }

  const [
    parentSlug,
    title,
    slug,
    prompt,
    answerSummary,
    evidenceExcerpt,
    evidenceSource,
    displayOrder,
    isActive,
  ] = args;

  if (typeof title !== "string" || typeof slug !== "string") {
    throw new Error("Título e slug devem ser strings no seed legado.");
  }

  if (typeof displayOrder !== "number") {
    throw new Error(`display_order inválido para slug ${slug}.`);
  }

  if (typeof isActive !== "boolean") {
    throw new Error(`is_active inválido para slug ${slug}.`);
  }

  const overrideKey = `${parentSlug ?? "null"}|${title}|${slug}`;
  const normalizedSlug = TG_TCC_SLUG_OVERRIDES.get(overrideKey) ?? slug;

  return {
    parentSlug: typeof parentSlug === "string" ? parentSlug : null,
    title,
    slug: normalizedSlug,
    prompt: typeof prompt === "string" ? prompt : null,
    answerSummary: typeof answerSummary === "string" ? answerSummary : null,
    evidenceExcerpt:
      typeof evidenceExcerpt === "string" ? evidenceExcerpt : null,
    evidenceSource: typeof evidenceSource === "string" ? evidenceSource : null,
    displayOrder,
    isActive,
  };
}

function ensureUniqueSlugs(nodes: LegacyNodeSeed[]): void {
  const seen = new Set<string>();

  for (const node of nodes) {
    if (seen.has(node.slug)) {
      throw new Error(
        `Slug duplicado encontrado após normalização: ${node.slug}`,
      );
    }
    seen.add(node.slug);
  }
}

async function upsertSeedUsers(): Promise<void> {
  for (const user of USER_SEEDS) {
    const passwordHash = await argon2.hash(user.password, ARGON2_OPTIONS);

    await prisma.user.upsert({
      where: { email: user.email },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        password_hash: passwordHash,
      },
      update: {
        name: user.name,
        role: user.role,
        password_hash: passwordHash,
      },
    });
  }
}

async function upsertSeedNodes(nodes: LegacyNodeSeed[]): Promise<void> {
  for (const node of nodes) {
    let parentId: number | null = null;

    if (node.parentSlug) {
      const parent = await prisma.chatNode.findUnique({
        where: { slug: node.parentSlug },
        select: { id: true },
      });

      if (!parent) {
        throw new Error(
          `Nó pai com slug '${node.parentSlug}' não encontrado para o nó '${node.slug}'.`,
        );
      }

      parentId = parent.id;
    }

    await prisma.chatNode.upsert({
      where: { slug: node.slug },
      create: {
        parent_id: parentId,
        title: node.title,
        slug: node.slug,
        prompt: node.prompt,
        answer_summary: node.answerSummary,
        evidence_excerpt: node.evidenceExcerpt,
        evidence_source: node.evidenceSource,
        display_order: node.displayOrder,
        is_active: node.isActive,
      },
      update: {
        parent_id: parentId,
        title: node.title,
        prompt: node.prompt,
        answer_summary: node.answerSummary,
        evidence_excerpt: node.evidenceExcerpt,
        evidence_source: node.evidenceSource,
        display_order: node.displayOrder,
        is_active: node.isActive,
      },
    });
  }

  await prisma.chatNode.updateMany({
    where: { slug: { in: DEACTIVATE_SLUGS } },
    data: { is_active: false },
  });
}

async function main(): Promise<void> {
  const legacySql = await readFile(LEGACY_SQL_SEED_PATH, "utf8");
  const nodeCalls = extractLegacySeedCalls(legacySql);
  const parsedNodes = nodeCalls.map(parseLegacyNodeSeed);

  ensureUniqueSlugs(parsedNodes);

  await upsertSeedUsers();
  await upsertSeedNodes(parsedNodes);

  const expectedNodeCount = new Set(parsedNodes.map((node) => node.slug)).size;
  const persistedNodeCount = await prisma.chatNode.count({
    where: { slug: { in: [...new Set(parsedNodes.map((node) => node.slug))] } },
  });

  if (persistedNodeCount !== expectedNodeCount) {
    throw new Error(
      `Verificação final falhou: esperado ${expectedNodeCount} nós, persistido ${persistedNodeCount}.`,
    );
  }

  console.info(
    `Seed concluído com sucesso: ${USER_SEEDS.length} usuários e ${expectedNodeCount} nós.`,
  );
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
