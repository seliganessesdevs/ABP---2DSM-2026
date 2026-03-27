# JWT + Argon2id — Guia para Iniciantes

Autenticação responde a uma pergunta simples: **quem está fazendo essa requisição?** JWT e Argon2id são as duas ferramentas que respondem isso com segurança. Elas resolvem problemas diferentes e trabalham juntas.

---

## O Problema que Cada Uma Resolve

**Argon2id** — resolve o problema de armazenar senhas. Você nunca salva a senha no banco. Se o banco vazar, o atacante não consegue usar os dados. O Argon2id é memory-hard (64 MiB por hash na configuração recomendada), venceu a Password Hashing Competition em 2015 e oferece resistência superior ao bcrypt contra ataques paralelos com GPU/ASIC.

**JWT** — resolve o problema de manter o usuário "logado". Após o login, o servidor emite um token que o cliente guarda e envia em cada requisição seguinte.

---

## Argon2id — Guardando Senhas com Segurança

Quando um usuário cria uma conta, você não salva a senha — salva um **hash** dela. Hash é uma transformação irreversível: dado o hash, é impossível descobrir a senha original.

O Argon2id usa **salt** aleatório e custo de memória por hash, garantindo que dois usuários com a mesma senha gerem hashes diferentes e encarecendo ataques de força bruta em hardware paralelo.

A configuração de custo combina memória, tempo e paralelismo. Uma base segura e prática é `memoryCost: 65536` (64 MiB), `timeCost: 3` e `parallelism: 1`, balanceando segurança e latência.

```ts
// No cadastro — nunca salve a senha direta
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
});
await prisma.user.create({ data: { email, password: hash } });

// No login — compare a senha enviada com o hash salvo
const senhaCorreta = await argon2.verify(user.password, passwordEnviado);

if (!senhaCorreta) {
  throw new AppError("E-mail ou senha inválidos", 401);
}
```

**Nunca compare senhas com `===`** — você nunca tem a senha original para comparar, só o hash. Só o `argon2.verify` faz isso corretamente.

---

## JWT — Mantendo o Usuário Logado

HTTP é sem estado — cada requisição é independente, o servidor não lembra da anterior. O JWT resolve isso: após o login, o servidor emite um token que o cliente envia em toda requisição seguinte.

O token tem três partes separadas por ponto:

```
header.payload.signature
```

- **Header** — algoritmo usado para assinar
- **Payload** — dados do usuário (ID, role) — visível por qualquer um
- **Signature** — prova que o token não foi alterado — só quem tem o segredo consegue verificar

> ⚠️ O payload do JWT **não é criptografado** — é apenas codificado em base64. Qualquer pessoa pode ler o conteúdo. Nunca coloque dados sensíveis ali (senha, cartão, CPF).

---

## O Fluxo Completo de Autenticação

```
1. Usuário envia email + senha

2. Backend busca o usuário pelo email
   → não encontrou: responde 401

3. argon2.verify(hash do banco, senhaEnviada)
   → senhas não batem: responde 401

4. Gera o JWT com o ID e role do usuário
   → responde 200 com o token

5. Cliente guarda o token (localStorage ou cookie)

6. Nas próximas requisições, envia no header:
   Authorization: Bearer <token>

7. Middleware de auth valida o token
   → inválido ou expirado: responde 401
   → válido: adiciona req.user e continua
```

---

## Gerando e Validando o Token

```ts
// Gerando após login bem-sucedido
const token = jwt.sign(
  { sub: user.id, role: user.role }, // payload — o que fica dentro do token
  process.env.JWT_SECRET, // segredo — nunca commite isso
  { expiresIn: "7d" }, // tempo de validade
);

// Validando no middleware de auth
const payload = jwt.verify(token, process.env.JWT_SECRET);
// se inválido ou expirado, jwt.verify lança uma exceção automaticamente
```

O `sub` (subject) é a convenção JWT para identificar o dono do token — use o ID do usuário.

---

## O que Guardar no Payload

O payload é lido em toda requisição autenticada — deve ser **pequeno** e conter só o necessário para identificar o usuário e autorizar o acesso:

```ts
// ✅ payload enxuto
{ sub: user.id, role: user.role }

// ❌ payload com dado sensível
{ sub: user.id, email: user.email, password: user.password }

// ❌ payload com dado desnecessário
{ sub: user.id, name: user.name, createdAt: user.createdAt, ... }
```

Se precisar de mais dados do usuário durante a requisição, busque no banco usando o `req.user.sub` — não encha o token.

---

## Expiração do Token

Todo token deve expirar. Sem expiração, um token roubado funciona para sempre.

| Contexto            | Validade sugerida  |
| ------------------- | ------------------ |
| Aplicação web comum | `7d`               |
| Dados sensíveis     | `1h` ou `15m`      |
| Nunca expire        | ❌ nunca faça isso |

Quando o token expira, o cliente recebe `401` e precisa fazer login novamente.

---

## Mensagem de Erro no Login

Nunca informe qual parte do login está errada:

```ts
// ❌ informa ao atacante que o e-mail existe
throw new AppError("Senha incorreta", 401);

// ✅ mensagem genérica — não ajuda um atacante
throw new AppError("E-mail ou senha inválidos", 401);
```

---

## Variáveis de Ambiente

O `JWT_SECRET` nunca pode aparecer no código ou ser commitado:

```bash
# .env — nunca commite este arquivo
JWT_SECRET=uma-string-longa-aleatoria-e-secreta

# .env.example — commite este, sem os valores
JWT_SECRET=
```

Quanto mais longo e aleatório o segredo, melhor. Use um gerador como `openssl rand -base64 32` para criar um.

---

## Boas Práticas

**Nunca salve senha sem hash** — se o banco vazar com senhas em texto puro, todos os usuários estão comprometidos imediatamente.

**Nunca crie seu próprio algoritmo de hash** — use Argon2id. Algoritmos comuns como MD5 e SHA-256 são rápidos demais — ótimos para checksum, péssimos para senha porque facilitam ataques de força bruta. Entre algoritmos de senha, o Argon2id oferece vantagem por ser memory-hard e mais resistente que bcrypt a aceleração por GPU/ASIC.

**Sempre defina expiração no token** — um token sem expiração é uma sessão eterna que você não consegue encerrar.

**Guarde o `JWT_SECRET` em variável de ambiente** — hardcodar o segredo no código é uma das vulnerabilidades mais comuns e mais graves.

**Retorne a mesma mensagem para e-mail e senha inválidos** — mensagens específicas ajudam atacantes a enumerar usuários cadastrados.

---

> _Próximo documento: [`prisma.md`](./prisma.md)_
