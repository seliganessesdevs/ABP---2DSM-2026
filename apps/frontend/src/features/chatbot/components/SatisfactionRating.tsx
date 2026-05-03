import { useState } from "react";
import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { chatbotApi } from "../api/chatbot.api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SatisfactionRating({
  navigation_flow,
  nodeId,
}: {
  navigation_flow: string[];
  nodeId: number;
}) {
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<"ATENDEU" | "NAO_ATENDEU" | null>(
    null,
  );

  async function handleGostei() {
    setSelected("ATENDEU");
    setLoading(true);
    setError(null);
    try {
      await chatbotApi.submitRating({
        navigation_flow,
        node_id: nodeId,
        flag: "ATENDEU",
      });
      setHasVoted(true);
    } catch (e) {
      setError("Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  }

  async function handleNaoGostei() {
    setSelected("NAO_ATENDEU");
    setLoading(true);
    setError(null);
    try {
      await chatbotApi.submitRating({
        navigation_flow,
        node_id: nodeId,
        flag: "NAO_ATENDEU",
      });
      setHasVoted(true);
    } catch (e) {
      setError("Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  }

  const checkColor = selected === "ATENDEU" ? "bg-[#5B8E73]" : "bg-[#D4261A]";

  return (
    <div className="relative inline-flex w-fit max-w-full flex-col space-y-2 rounded-2xl border border-border bg-card px-4 py-3">
      {hasVoted ? (
        <p
          className="text-right text-sm font-semibold text-foreground"
          role="status"
        >
          Obrigado pelo feedback!
        </p>
      ) : (
        <>
          <p className="text-right text-xs font-medium text-muted-foreground">
            Essa informação foi útil?
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              onClick={handleGostei}
              disabled={loading}
              variant="outline"
              className={cn(
                "gap-2 border-2 bg-transparent text-xs font-semibold transition-colors sm:text-sm",
                "border-[#5B8E73] text-[#5B8E73] hover:bg-[#5B8E73] hover:text-white",
                "focus-visible:ring-[#5B8E73]/30",
              )}
            >
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              Gostei
            </Button>

            <Button
              type="button"
              onClick={handleNaoGostei}
              disabled={loading}
              variant="outline"
              className={cn(
                "gap-2 border-2 bg-transparent text-xs font-semibold transition-colors sm:text-sm",
                "border-[#D4261A] text-[#D4261A] hover:bg-[#D4261A] hover:text-white",
                "focus-visible:ring-[#D4261A]/30",
              )}
            >
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />
              Não Gostei
            </Button>
          </div>

          {loading && (
            <p
              className="text-right text-xs text-muted-foreground"
              role="status"
            >
              Enviando avaliação...
            </p>
          )}

          {!loading && error && (
            <p className="text-right text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </>
      )}

      {hasVoted && selected && (
        <span
          className={cn(
            "absolute -bottom-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white text-white",
            checkColor,
          )}
          aria-hidden="true"
        >
          <Check className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}
