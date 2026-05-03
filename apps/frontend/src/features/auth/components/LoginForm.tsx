import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";
import type { LoginPayload } from "../types/auth.types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import jacareImg from "@/assets/admin_jacare.png";
import fatecImg from "@/assets/login_fatec.png";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="relative flex min-h-screen items-center justify-center bg-[#F1EDE2] px-6 py-10">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute right-4 top-4 flex min-w-[140px] cursor-pointer items-center justify-center gap-2 rounded-md bg-[#B20000] px-6 py-3 text-lg text-white transition-colors hover:bg-[#7D0000]"
      >
        Home <span>→</span>
      </button>

      <img
        src={fatecImg}
        alt="Fatec"
        className="absolute bottom-4 right-4 w-48 object-contain opacity-90 md:w-56"
      />

      <div className="w-full max-w-[760px] rounded-[24px] bg-[#FAFAFA] px-12 py-16 shadow-[0_24px_70px_rgba(86,61,24,0.14)] md:px-20 md:py-20">
        <div className="mb-8 flex items-center justify-center gap-4 md:gap-5">
          <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full  border-green-800 md:h-44 md:w-44">
            <img
              src={jacareImg}
              alt="Jacaré"
              className="h-full w-full object-contain scale-x-[-1]"            />
          </div>
          <h1 className="text-[52px] font-semibold leading-none text-black md:text-[68px]">
            FatecBot
          </h1>
        </div>

        <div
          className={`
            rounded-sm bg-[#F1EDE2] text-center text-base text-[#D4261A]
            transition-all duration-200
            ${
              error || hasFormError
                ? "mb-6 p-3 opacity-100"
                : "mb-0 h-0 overflow-hidden p-0 opacity-0"
            }
          `}
        >
          {(error || hasFormError) && "Email ou senha inválida"}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <Input
            id="email"
            type="email"
            placeholder="Email"
            disabled={isLoading}
            className="h-12 border border-[#7D0000] px-4 text-base focus-visible:ring-[#B20000] md:h-14 md:text-lg"
            {...register("email")}
          />

          <Input
            id="password"
            type="password"
            placeholder="Senha"
            disabled={isLoading}
            className="h-12 border border-[#7D0000] px-4 text-base focus-visible:ring-[#B20000] md:h-14 md:text-lg"
            {...register("password")}
          />

          <Button
            type="submit"
            className="mt-3 h-12 w-full cursor-pointer rounded-md bg-[#B20000] text-base text-white hover:bg-[#7D0000] md:h-14 md:text-lg"
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
