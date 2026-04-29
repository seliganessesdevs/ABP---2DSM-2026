import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../hooks/useLogin";
import type { LoginPayload } from "../types/auth.types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import jacareImg from "@/assets/login_jacare.png";
import fatecImg from "@/assets/login_fatec.png";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(schema),
  });

  const { login, isLoading, error } = useLogin();

  const hasFormError = Object.keys(errors).length > 0;

  const onSubmit = (values: LoginPayload) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1EDE2] relative">
      
      {/* Botão Home */}
      <button className="absolute top-4 right-4 bg-[#B20000] hover:bg-[#7D0000] text-white px-6 py-3 min-w-[140px] rounded-md flex items-center justify-center gap-2 text-lg">
        Home <span>→</span>
      </button>

      {/* Logo Fatec */}
      <img
        src={fatecImg}
        alt="Fatec"
        className="absolute bottom-4 right-4 w-48 object-contain"
      />

      <div className="bg-[#FAFAFA] p-6 rounded-md shadow-md w-full max-w-sm">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={jacareImg}
              alt="Jacaré"
              className="w-[60px] h-[60px] object-contain scale-x-[-1]"
            />
          </div>
          <h1 className="text-[48px] font-semibold text-black">
            FatecBot
          </h1>
        </div>

        {/* Caixa de erro unificada */}
        <div
          className={`
            bg-[#F1EDE2] text-[#D4261A] text-sm text-center rounded-sm
            transition-all duration-200
            ${
              error || hasFormError
                ? "opacity-100 p-2 mb-4"
                : "opacity-0 h-0 p-0 mb-0 overflow-hidden"
            }
          `}
        >
          {(error || hasFormError) && "Email ou senha inválida"}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-2"
        >
          {/* Email */}
          <Input
            id="email"
            type="email"
            placeholder="Email"
            disabled={isLoading}
            className="border border-[#7D0000] focus-visible:ring-[#B20000]"
            {...register("email")}
          />

          {/* Senha */}
          <Input
            id="password"
            type="password"
            placeholder="Senha"
            disabled={isLoading}
            className="border border-[#7D0000] focus-visible:ring-[#B20000]"
            {...register("password")}
          />

          {/* Botão */}
          <Button
            type="submit"
            className="w-full mt-2 bg-[#B20000] hover:bg-[#7D0000] text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};