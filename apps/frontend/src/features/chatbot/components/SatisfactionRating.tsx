import {useState} from "react";
import { chatbotApi } from "../api/chatbot.api";
import { Button } from "@/components/ui/button";

export function SatisfactionRating({navigation_flow}: {navigation_flow: string[]}){
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

     async function handleGostei(){
        setLoading(true);
        setError(null);
        try {
            await chatbotApi.submitRating({ navigation_flow, flag: "ATENDEU" });
            setHasVoted(true);
        } catch (e) {
            setError("Erro ao enviar avaliação");
        } finally {
            setLoading(false);
        }
     } 

     async function handleNaoGostei(){
        setLoading(true);
        setError(null);
        try {
            await chatbotApi.submitRating({ navigation_flow, flag: "NAO_ATENDEU" });
            setHasVoted(true);
        } catch (e) {
            setError("Erro ao enviar avaliação");
        } finally {
            setLoading(false);
        }
     }

     return (
        <div>
            {hasVoted ? (
      <span>Obrigado pelo feedback!</span>
    ) : (
      <>
        <Button
            onClick={handleGostei}
            disabled={loading}
            className="mr-2"
            variant="secondary"
        >
        👍 Gostei
        </Button>
        <Button
        onClick={handleNaoGostei}
        disabled={loading}
        variant="destructive"
        >
        👎 Não gostei
        </Button>
        {error && <span>{error}</span>}
      </>
    )}
        </div>
     )
}