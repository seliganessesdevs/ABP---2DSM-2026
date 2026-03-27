# 📁 src/utils/

Funções utilitárias puras e reutilizáveis. Nenhum arquivo aqui tem estado, nenhum conhece Express, nenhum fala com o banco — são apenas funções que recebem entrada e retornam saída, usadas em qualquer lugar da aplicação.

---

## Estrutura

```
utils/
├── hash.ts       # Gera e compara hashes de senha com Argon2id
├── jwt.ts        # Gera e valida tokens JWT
└── pagination.ts # Calcula offset/limit a partir de page/pageSize
```

---

## `hash.ts`

Abstrai o `Argon2id` em duas funções simples. Senhas **nunca** são armazenadas em texto puro — sempre passam por aqui antes de ir ao banco. O Argon2id é memory-hard (64 MiB por hash), venceu a Password Hashing Competition em 2015 e oferece resistência superior ao bcrypt contra ataques com GPU/ASIC.

```ts
// No service de users — ao criar usuário
const hashed = await hashPassword(plainPassword);
await prisma.user.create({ data: { ...dto, password: hashed } });

// No service de auth — ao fazer login
const isValid = await comparePassword(plainPassword, user.password);
if (!isValid) throw new AppError("Email ou senha inválidos.", 401);
```

O custo do Argon2id (`memoryCost: 65536`, `timeCost: 3`, `parallelism: 1`) é configurado via `env.ts` — não hardcoded aqui. Aumentar custo de memória/tempo aumenta a segurança, com impacto controlado no tempo de resposta do login.

---

## `jwt.ts`

Abstrai o `jsonwebtoken` em duas funções. O token gerado carrega o `sub` (ID do usuário) e o `role`, que o `auth.middleware` usa para popular o `req.user`.

```ts
// No service de auth — após validar senha
const token = generateToken({ sub: user.id, role: user.role });
return { token };

// No auth.middleware — ao validar a requisição
const payload = verifyToken(token);
req.user = payload; // { sub, role, iat, exp }
```

Se o token estiver expirado ou com assinatura inválida, `verifyToken` lança — o `auth.middleware` captura e responde `401`.

---

## `pagination.ts`

Converte os parâmetros de query (`page`, `pageSize`) nos valores que o Prisma espera (`skip`, `take`). Centraliza também os valores padrão para que não fiquem espalhados nos services.

```ts
// No service de questions
const { skip, take } = paginate(req.query);

const [data, total] = await prisma.$transaction([
  prisma.question.findMany({ skip, take }),
  prisma.question.count(),
]);

return { data, total, page, pageSize };
```

**Por que centralizar?**

Sem isso, cada service implementaria a lógica de `(page - 1) * pageSize` na mão — com valores padrão diferentes, possibilidade de `NaN` se `page` vier como string inválida, e sem tratamento de página negativa. O `paginate()` trata tudo isso em um lugar só.

---

## Regras de contribuição

- Funções utilitárias devem ser **puras** — sem efeitos colaterais, sem imports de `prisma` ou `req/res`
- Se uma função só é usada em um módulo específico, ela fica **dentro daquele módulo** — esta pasta é só para o que é reaproveitado
- Toda função deve ser exportada individualmente (named export) — sem export default

---
