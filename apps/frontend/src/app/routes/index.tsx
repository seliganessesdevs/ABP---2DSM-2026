import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "@/assets/login_jacare.png";
import jacareImg from "@/assets/home_jacare.png";
import fatecImg from "@/assets/login_fatec.png";
import { ChatWindow } from "@/features/chatbot/components/ChatWindow";

const Home: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  if (isChatOpen) {
    return <ChatWindow />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F1EDE2]">
      <header className="flex w-full items-center justify-between border-b-2 border-[#B20000] bg-[#FAFAFA] px-5 py-5 md:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-800 md:h-14 md:w-14">
            <img
              src={logoImg}
              alt="Jacaré"
              className="h-[60px] w-[60px] object-contain scale-x-[-1] md:h-[68px] md:w-[68px]"
            />
          </div>
          <h1 className="text-xl font-semibold md:text-2xl">FatecBot</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-[#B20000] px-4 py-2.5 text-base text-white transition-colors hover:bg-[#7D0000] md:px-6 md:py-3 md:text-lg"
        >
          Área Restrita <span>→</span>
        </button>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        <div className="flex w-full flex-col justify-center px-8 py-14 md:w-1/2 md:px-20 xl:px-28">
          <span className="mb-3 text-base font-semibold text-[#B20000] md:text-lg">
            SECRETARIA ACADÊMICA DIGITAL
          </span>

          <h2 className="mb-6 max-w-[16ch] text-4xl font-bold leading-tight md:text-6xl xl:max-w-[18ch] xl:text-7xl">
            Secretaria Acadêmica na palma da sua mão.
          </h2>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-2xl">
            Tire dúvidas sobre calendário, matrícula, estágio e regulamento sem
            sair de casa. Disponível 24h, sem cadastro.
          </p>

          <button
            onClick={() => setIsChatOpen(true)}
            className="flex w-fit cursor-pointer items-center gap-3 rounded-xl bg-[#B20000] px-7 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(178,0,0,0.18)] transition-colors hover:bg-[#7D0000] md:px-9 md:py-5 md:text-2xl"
          >
            Iniciar Atendimento
          </button>
        </div>

        <div className="relative flex w-full items-center justify-center overflow-hidden bg-[#E9E4D8] py-16 md:w-1/2 md:py-0">
          <div className="relative flex items-center justify-center">
            <div className="absolute right-2 top-2 rotate-2 rounded-md bg-white px-3 py-2 text-sm shadow md:right-10 md:top-10 md:px-4 md:text-base">
              📄 Matrícula aberta
            </div>

            <div className="absolute left-2 top-32 -rotate-2 rounded-md bg-white px-3 py-2 text-sm shadow md:left-10 md:top-40 md:px-4 md:text-base">
              📆 Calendário 2026
            </div>

            <div className="absolute bottom-2 right-6 rotate-1 rounded-md bg-white px-3 py-2 text-sm shadow md:bottom-10 md:right-20 md:px-4 md:text-base">
              🎓 Estágio: dúvidas
            </div>

            <img
              src={jacareImg}
              alt="Jacaré grande"
              className="w-[420px] object-contain md:w-[820px] xl:w-[920px]"
            />
          </div>

          <img
            src={fatecImg}
            alt="Fatec"
            className="absolute bottom-0 right-4 w-40 opacity-90 md:bottom-8 md:right-8 md:w-52"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
