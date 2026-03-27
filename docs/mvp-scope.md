# Escopo do MVP

## Objetivo do MVP

Entregar um chatbot web funcional para autoatendimento acadêmico com navegação guiada, registro de sessão, envio de pergunta à secretaria e painéis mínimos para administração e acompanhamento.

## Must

- Frontend público exibindo o chatbot e carregando o nó raiz da API
- Backend com endpoints públicos para navegação nos nós, registro de satisfação e envio de pergunta
- Autenticação por login para Admin e Secretária com JWT
- Proteção de rotas e autorização por role no backend
- Painel Admin com operação mínima sobre nós, documentos, usuários e logs
- Painel da Secretária com listagem e atualização de status das perguntas
- Banco PostgreSQL com schema inicial, migration e seed de desenvolvimento
- Execução completa via `docker compose up --build`

## Should

- Filtros paginados nas listagens internas
- Exibição de evidência documental nos nós de resposta
- Cobertura de testes além do mínimo obrigatório por sprint
- Melhorias de UX no chatbot, mensagens de erro e estados de loading

## Won't

- Envio automático de e-mails ao aluno
- Busca semântica, IA generativa ou RAG fora da árvore de nós
- Upload avançado, OCR ou processamento automático de PDFs no semestre
- Multi-tenant, múltiplas Fatecs ou personalização por unidade
- Observabilidade avançada, métricas externas ou fila assíncrona dedicada

## Critério de corte

Se o time não conseguir entregar todo o Must, a ordem de prioridade deve ser:

1. Arquitetura base funcionando em Docker com banco, seed, health check e chatbot público carregando da API
2. Envio de pergunta e persistência de `SessionLog`
3. Login e proteção de rotas
4. Painel da Secretária para tratar perguntas
5. Painel Admin completo para manutenção de conteúdo e logs

> _Próximo documento: [`seed-data.md`](./seed-data.md)_
