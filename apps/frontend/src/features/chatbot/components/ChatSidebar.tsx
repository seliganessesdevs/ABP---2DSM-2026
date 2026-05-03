import mascotImg from "@/assets/login_jacare.png";
import type { ChatSidebarHistoryItem } from "../types/chatbot.types";
import { QuestionForm } from "./QuestionForm";

interface ChatSidebarProps {
  historyItems: ChatSidebarHistoryItem[];
  onHistoryItemClick: (messageId: string) => void;
}

export function ChatSidebar({
  historyItems,
  onHistoryItemClick,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-[#D8D1C0] bg-[#FAFAFA] shadow-[0_20px_50px_rgba(92,53,12,0.08)]">
      <div className="border-b-4 border-[#B20000] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#6D9F84] bg-[#F3EEE2]">
            <img
              src={mascotImg}
              alt="Mascote Caré"
              className="h-12 w-12 object-contain"
            />
          </div>

          <div>
            <h2 className="text-[2rem] font-black leading-none text-[#1C262E]">
              Caré
            </h2>
            <p className="mt-1 text-xs font-medium text-[#535353]">
              O assistente da secretaria acadêmica da Fatec Jacareí
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="text-sm font-medium text-[#8A867E]">
          Histórico de perguntas
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {historyItems.length > 0 ? (
            historyItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onHistoryItemClick(item.messageId)}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition-colors hover:border-[#E0C5C1] hover:bg-[#F8F1F0]"
              >
                <span
                  aria-hidden="true"
                  className="h-8 w-1 rounded-full bg-[#B20000]"
                />
                <span className="text-lg font-bold text-[#B20000]">
                  {item.label}
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D8D1C0] bg-[#F6F1E7] px-4 py-5 text-sm text-[#7B756C]">
              As perguntas visitadas vão aparecer aqui conforme a conversa avança.
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#ECE4D6] p-5 pt-3">
        <QuestionForm variant="sidebar" />
      </div>
    </aside>
  );
}
