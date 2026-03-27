# ADRs — Architecture Decision Records

> Registro das decisões arquiteturais aceitas para o FatecBot.

***

## ADR-001 — Monorepo com pnpm workspaces
**Status:** Aceito
**Contexto:** O projeto possui frontend e backend versionados juntos, com documentação compartilhada e necessidade de scripts centralizados.
**Decisão:** Adotar monorepo com `pnpm workspaces`, mantendo `apps/frontend` e `apps/backend` sob a mesma raiz.
**Consequências:** Simplifica setup, padroniza scripts e centraliza dependências; exige mais disciplina em documentação, filtros de workspace e organização por pasta.

## ADR-002 — Chatbot baseado em árvore de nós (`ChatNode` auto-referenciada)
**Status:** Aceito
**Contexto:** O FatecBot precisa guiar o usuário por menus e submenus previsíveis, com resposta final rastreável a documentos oficiais.
**Decisão:** Modelar a navegação como uma árvore auto-referenciada de `ChatNode`, em que cada nó conhece seu `parentId`, seu `nodeType` e a ordem entre irmãos.
**Consequências:** Facilita navegação determinística, seed inicial e manutenção manual do fluxo; exige validações claras de integridade da árvore e separação entre leitura pública e CRUD administrativo.

## ADR-003 — Argon2id em vez de bcrypt para hash de senhas
**Status:** Aceito
**Contexto:** O projeto precisa armazenar senhas com proteção adequada para um sistema com autenticação JWT e perfis internos.
**Decisão:** Usar a biblioteca `argon2` configurada em modo Argon2id para hashing e verificação de senhas.
**Consequências:** Aumenta a resistência contra ataques paralelos em GPU/ASIC e mantém alinhamento com boas práticas atuais; adiciona custo computacional maior no login e exige documentação clara de configuração.

***

> _Próximo documento: [`../first-steps.md`](../first-steps.md)_
