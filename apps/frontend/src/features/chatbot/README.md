# 🤖 features/chatbot — Navegação Conversacional

> Feature responsável por toda a experiência do chatbot: navegação pela árvore
> de nós, exibição de respostas e evidências documentais, envio de perguntas
> à secretaria e registro de satisfação ao fim do atendimento (RF01, RF02, RF05, RF07).

---

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Fluxo de Navegação](#fluxo)
- [Regras de Contribuição](#regras)

---

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Esta feature é o **núcleo da aplicação** do ponto de vista do usuário final.
É aqui que o aluno navega pelos menus, recebe respostas estruturadas com evidências
de documentos oficiais, envia dúvidas à secretaria e avalia o atendimento.

Não exige autenticação — o acesso é **totalmente público** (RF03).

| Responsabilidade                                | Onde vive                 |
| ----------------------------------------------- | ------------------------- |
| Busca do nó raiz e navegação entre nós          | `api/chatbot.api.ts`      |
| Envio de pergunta à secretaria                  | `api/chatbot.api.ts`      |
| Registro de satisfação e log de sessão          | `api/chatbot.api.ts`      |
| Orquestração do estado de navegação, histórico e sessão | `hooks/useChatNavigation` |
| Interface visual da conversa                    | `components/ChatWindow`   |
| Tipagem dos nós, chunks e sessão                | `types/chatbot.types.ts`  |

---

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
features/chatbot/
├── api/
│   └── chatbot.api.ts          # GET /nodes/root, GET /nodes/:id, POST /sessions/log, POST /questions
│
├── components/
│   ├── ChatWindow.tsx             # Container principal — orquestra todos os outros
│   │
│   ├── MessageBubble.tsx          # Renderiza mensagem do bot ou escolha do usuário
│   │
│   ├── OptionButton.tsx           # Botão de opção navegável (filhos de nó MENU)
│   │
│   ├── EvidenceCard.tsx           # Exibe chunk de documento com fonte e página
│   │
│   ├── SatisfactionRating.tsx     # Botões "Gostei / Não gostei" com submit
│   │
│   └── QuestionForm.tsx           # Formulário de envio de dúvida à secretaria
│
│
├── hooks/
│   ├── useChatNavigation.ts    # Estado de navegação, histórico e nó atual
│   ├── useSubmitQuestion.ts    # useMutation: POST /questions
│   └── useSubmitRating.ts      # useMutation: POST /sessions/log
│
└── types/
    └── chatbot.types.ts        # ChatNode, SessionRatingPayload, QuestionFormData, SubmitQuestionPayload
```

---

## 🧱 Camadas <a id="camadas"></a>

### api/

Funções puras de acesso à API. Separadas por domínio para manter cada arquivo
com responsabilidade única.

```ts
// ✅ Padrão adotado em api/
export const chatbotApi = {
  getRoot: () => api.get<ChatNode>("/nodes/root").then((res) => res.data),
  getNode: (id: string) =>
    api.get<ChatNode>(`/nodes/${id}`).then((res) => res.data),
};
```

### hooks/

O `useChatNavigation` é o hook central desta feature. Gerencia o nó atual,
o histórico de navegação, o fluxo acumulado da sessão e o identificador
persistido da sessão quando o usuário começa a avaliar respostas.

```ts
// ✅ Padrão adotado — estado de navegação centralizado
export function useChatNavigation() {
  const [history, setHistory] = useState<ChatNode[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  const { data: currentNode } = useQuery({
    queryKey: ["node", currentNodeId],
    queryFn: () =>
      currentNodeId ? chatbotApi.getNode(currentNodeId) : chatbotApi.getRoot(),
  });

  const navigateTo = (nodeId: string) => {
    if (currentNode) setHistory((prev) => [...prev, currentNode]);
    setCurrentNodeId(nodeId);
  };

  const goBack = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory((prev) => prev.slice(0, -1));
    setCurrentNodeId(previous.id);
  };

  return { currentNode, navigateTo, goBack, canGoBack: history.length > 0 };
}

// ❌ Nunca gerencie o estado de navegação dentro de ChatWindow ou OptionButton
```

### components/

O `ChatWindow` é o único componente que consome `useChatNavigation` diretamente.
Os demais recebem dados e callbacks via props — sem acesso direto a hooks de dados.

```tsx
// ✅ Hierarquia correta de componentes
<ChatWindow>
  {" "}
  ← consome useChatNavigation
  <MessageBubble /> ← recebe message via props
  <OptionButton /> ← recebe onSelect via props
  <EvidenceCard /> ← recebe chunk via props
  <SatisfactionRating /> ← recebe onRate via props
  <QuestionForm /> ← recebe onSubmit via props
</ChatWindow>

// ❌ OptionButton não deve chamar useChatNavigation por conta própria
```

---

## 🔄 Fluxo de Navegação <a id="fluxo"></a>

```
Página carrega → GET /nodes/root → exibe nó raiz com opções
        ↓
Usuário escolhe opção → GET /nodes/:id → exibe nó filho
        ↓  (repete até atingir nó do tipo ANSWER)
Nó ANSWER exibido → mostra resposta + EvidenceCard (se houver chunk)
        ↓
Usuário avalia → POST /sessions/log → cria ou atualiza a mesma sessão
        ↓
Usuário pode voltar ao nó raiz → continua no mesmo histórico visual e persistido
        ↓
Usuário pode enviar dúvida → POST /questions → encaminha à secretaria (RF05)
```

> ⚠️ Nós do tipo `MENU` sempre têm filhos e exibem `OptionButton`.
> Nós do tipo `ANSWER` nunca têm filhos — exibem a resposta, o `EvidenceCard`,
> os controles de satisfação e a ação para voltar ao início sem abrir uma nova sessão.

---

## 📐 Regras de Contribuição <a id="regras"></a>

- **Todo estado de navegação** vive em `useChatNavigation` — nunca em `useState` local dentro de `ChatWindow`
- Componentes filhos de `ChatWindow` recebem dados **exclusivamente via props** — sem hooks de dados próprios
- **Nunca** importe `chatbotApi` diretamente em um componente — passe sempre por um hook
- Novos endpoints relacionados ao chatbot entram em `api/chatbot.api.ts`; endpoints de domínio próprio (perguntas, sessões) mantêm arquivos separados
- A navegação de volta (`goBack`) deve sempre respeitar o histórico — **nunca** use `navigate(-1)` do React Router nesta feature

---

> _Este README deve ser atualizado sempre que novos tipos de nó, novos endpoints
> de sessão ou novos componentes de interação forem adicionados ao chatbot._

> _Próximo documento: [`../auth/README.md`](../auth/README.md)_
