# Seed Data

## Usuários criados pelo seed

| E-mail | Senha | Role | O que acessa |
| ------ | ----- | ---- | ------------ |
| `admin@fatec.sp.gov.br` | `admin123` | `ADMIN` | Painel administrativo, gestão de nós, documentos, usuários e logs |
| `secretaria@fatec.sp.gov.br` | `secretaria123` | `SECRETARY` | Painel da secretária e atualização de status das perguntas |

> O perfil Aluno não é criado pelo seed porque o acesso ao chatbot é público.

## Estrutura inicial do chatbot

```text
root (MENU)
├── Desenvolvimento de Software Multiplataforma (MENU)
│   ├── Atividades Complementares (ANSWER)
│   ├── Datas importantes do semestre (ANSWER)
│   ├── Disciplinas com atividades de extensão (ANSWER)
│   └── Estágio (MENU)
│       ├── Duração mínima (ANSWER)
│       └── Documentação exigida (ANSWER)
├── Geoprocessamento (MENU)
│   └── Informações gerais do curso (ANSWER)
├── Meio Ambiente e Recursos Hídricos (MENU)
│   └── Informações gerais do curso (ANSWER)
└── Não sou aluno (MENU)
    └── Informações institucionais iniciais (ANSWER)
```

## Dependências entre tabelas no seed

1. `User`
2. `Document`
3. `DocumentChunk`
4. `ChatNode`
5. Relações entre nós e chunks de evidência
6. Dados derivados de sessão e pergunta ficam para uso da aplicação, não para seed inicial

## Como resetar o banco

```bash
docker compose exec backend pnpm db:reset
```

> _Próximo documento: [`env-matrix.md`](./env-matrix.md)_
