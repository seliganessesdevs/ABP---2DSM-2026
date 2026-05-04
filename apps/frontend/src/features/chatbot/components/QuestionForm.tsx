import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitQuestion } from "../hooks/useSubmitQuestion";
import type { QuestionFormData } from "../types/chatbot.types";
import mascotImg from "@/assets/college_jacare.png";
import { cn } from "@/lib/utils";

const questionFormSchema = z.object({
  requester_name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  requester_email: z.string().email("Email inválido"),
  question: z.string().min(10, "Pergunta deve ter no mínimo 10 caracteres"),
  attachment: z
    .union([z.instanceof(File), z.instanceof(FileList)])
    .nullable()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val instanceof FileList ? val[0] : val;
    })
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Arquivo deve ter no máximo 5MB",
    )
    .refine(
      (file) =>
        !file || ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
      "Arquivo deve ser PDF, JPEG ou PNG",
    ),
});

interface QuestionFormProps {
  onSuccess?: () => void;
  variant?: "default" | "sidebar";
  className?: string;
}

export function QuestionForm({
  onSuccess,
  variant = "default",
  className,
}: QuestionFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(variant !== "sidebar");

  const { mutate: submitQuestion, isPending } = useSubmitQuestion();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: QuestionFormData) => {
    submitQuestion(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setAttachmentName(null);
          if (variant === "sidebar") {
            setIsExpanded(false);
          }
          reset();
          onSuccess?.();
        }, 2000);
      },
      onError: (error) => {
        console.error("Erro ao enviar pergunta:", error);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAttachmentName(file ? file.name : null);
  };

  const isSidebar = variant === "sidebar";
  const attachmentField = register("attachment");

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-gray-200 bg-white shadow-sm",
        isSidebar
          ? "flex max-h-full flex-col overflow-hidden rounded-[26px] border-[#E7DED1] bg-[#F4EFE5] p-0 shadow-none"
          : "max-w-lg p-6",
        className,
      )}
    >
      {isSidebar ? (
        <div className="px-6 pb-6 pt-5">
          <div className="rounded-[24px] bg-[#F8F5EE] px-5 py-5 text-center shadow-[inset_0_0_0_1px_rgba(150,121,92,0.08)]">
            <img
              src={mascotImg}
              alt="Mascote Caré"
              className="mx-auto h-56 w-56 object-contain"
            />
            <p className="mx-auto mt-3 max-w-[15rem] text-[11px] font-medium leading-relaxed text-[#847B70]">
              Caso eu não consiga te ajudar, você pode enviar sua dúvida para a secretaria.
            </p>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full border border-[#D8B8B5] bg-white px-5 py-2 text-sm font-bold text-[#B20000] transition-colors hover:bg-[#B20000] hover:text-white"
            >
              {isExpanded ? "Fechar formulário" : "Enviar dúvida"}
            </button>
          </div>
        </div>
      ) : (
        <h3 className="mb-4 px-6 pt-6 text-lg font-bold text-gray-900">
          Enviar Pergunta
        </h3>
      )}

      {isExpanded && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            isSidebar
              ? "flex max-h-[min(56vh,36rem)] flex-col border-t border-[#E7DED1] bg-white px-5 py-5"
              : "space-y-4 px-6 pb-6",
          )}
        >
          <div
            className={cn(
              "space-y-4",
              isSidebar ? "min-h-0 flex-1 overflow-y-auto pr-1" : "",
            )}
          >
            <div className="space-y-1">
              <label
                htmlFor="requester_name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                {...register("requester_name")}
                id="requester_name"
                type="text"
                placeholder="Seu nome"
                disabled={isSubmitted || isPending}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {errors.requester_name && (
                <p className="text-xs text-red-600">
                  {errors.requester_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="requester_email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                {...register("requester_email")}
                id="requester_email"
                type="email"
                placeholder="seu@email.com"
                disabled={isSubmitted || isPending}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {errors.requester_email && (
                <p className="text-xs text-red-600">
                  {errors.requester_email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700"
              >
                Dúvida
              </label>
              <textarea
                {...register("question")}
                id="question"
                placeholder="Descreva sua pergunta..."
                disabled={isSubmitted || isPending}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {errors.question && (
                <p className="text-xs text-red-600">{errors.question.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="attachment"
                className="block text-sm font-medium text-gray-700"
              >
                Anexo (opcional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  {...attachmentField}
                  id="attachment"
                  type="file"
                  onChange={(e) => {
                    attachmentField.onChange(e);
                    handleFileChange(e);
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isSubmitted || isPending}
                  className="hidden"
                />
                <label
                  htmlFor="attachment"
                  className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Anexo
                </label>
                {attachmentName && (
                  <span className="text-xs text-gray-600">{attachmentName}</span>
                )}
              </div>
              {errors.attachment && (
                <p className="text-xs text-red-600">
                  {errors.attachment.message}
                </p>
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex gap-2 pt-4",
              isSidebar ? "mt-4 border-t border-[#ECE4D6] bg-white pt-4" : "",
            )}
          >
            {isSubmitted ? (
              <button
                type="button"
                disabled
                className="flex-1 rounded-md bg-red-700 px-4 py-2 text-center font-medium text-white disabled:opacity-75"
              >
                Enviado com Sucesso
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 cursor-pointer rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isPending ? "Enviando..." : "Enviar"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
