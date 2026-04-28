import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitQuestion } from "../hooks/useSubmitQuestion";
import type { QuestionFormData } from "../types/chatbot.types";

// Zod schema for validation
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
      "Arquivo deve ter no máximo 5MB"
    )
    .refine(
      (file) =>
        !file ||
        [
          "application/pdf",
          "image/jpeg",
          "image/png",
        ].includes(file.type),
      "Arquivo deve ser PDF, JPEG ou PNG"
    ),
});

interface QuestionFormProps {
  onSuccess?: () => void;
}

export function QuestionForm({ onSuccess }: QuestionFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const { mutate: submitQuestion, isPending } = useSubmitQuestion();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    mode: "onChange",
  });

  const attachmentField = watch("attachment");

  const onSubmit = (data: QuestionFormData) => {
    submitQuestion(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setAttachmentName(null);
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
    if (file) {
      setAttachmentName(file.name);
    } else {
      setAttachmentName(null);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Enviar Pergunta</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1">
          <label htmlFor="requester_name" className="block text-sm font-medium text-gray-700">
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
            <p className="text-xs text-red-600">{errors.requester_name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="requester_email" className="block text-sm font-medium text-gray-700">
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
            <p className="text-xs text-red-600">{errors.requester_email.message}</p>
          )}
        </div>

        {/* Question Field */}
        <div className="space-y-1">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
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

        {/* Attachment Field */}
        <div className="space-y-1">
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
            Anexo (opcional)
          </label>
          <div className="flex items-center gap-2">
            <input
              {...register("attachment")}
              id="attachment"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isSubmitted || isPending}
              className="hidden"
            />
            <label
              htmlFor="attachment"
              className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Anexo
            </label>
            {attachmentName && (
              <span className="text-xs text-gray-600">{attachmentName}</span>
            )}
          </div>
          {errors.attachment && (
            <p className="text-xs text-red-600">{errors.attachment.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
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
              className="flex-1 rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isPending ? "Enviando..." : "Enviar"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
