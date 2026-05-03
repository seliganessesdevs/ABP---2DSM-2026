import { useState } from "react";
import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { chatbotApi } from "../api/chatbot.api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SatisfactionRatingProps {
  navigation_flow: string[];
  nodeId: number;
  sessionLogId: number | null;
  onSessionPersisted: (interactionLogId: number) => void;
}

export function SatisfactionRating({
  navigation_flow,
  nodeId,
  sessionLogId,
  onSessionPersisted,
}: SatisfactionRatingProps) {
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<"ATENDEU" | "NAO_ATENDEU" | null>(
    null,
  );

  async function handleRating(flag: "ATENDEU" | "NAO_ATENDEU") {
    setSelected(flag);
    setLoading(true);
    setError(null);

    try {
      const result = await chatbotApi.submitRating({
        navigation_flow,
        node_id: nodeId,
        flag,
        ...(sessionLogId ? { session_log_id: sessionLogId } : {}),
      });

      onSessionPersisted(result.interactionLogId);
      setHasVoted(true);
    } catch {
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
              onClick={() => handleRating("ATENDEU")}
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
              onClick={() => handleRating("NAO_ATENDEU")}
              disabled={loading}
              variant="outline"
              className={cn(
                "gap-2 border-2 bg-transparent text-xs font-semibold transition-colors sm:text-sm",
                "border-[#D4261A] text-[#D4261A] hover:bg-[#D4261A] hover:text-white",
                "focus-visible:ring-[#D4261A]/30",
              )}
            >
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />
              Não gostei
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
