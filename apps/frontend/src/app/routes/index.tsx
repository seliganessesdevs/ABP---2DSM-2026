import React, { useState } from "react";

import logoImg from "@/assets/login_jacare.png";
import jacareImg from "@/assets/home_jacare.png";
import fatecImg from "@/assets/login_fatec.png";
import { ChatWindow } from "@/features/chatbot/components/ChatWindow";

const Home: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isChatOpen) {
    return <ChatWindow />;
  }

  return (
    <div className="min-h-screen bg-[#F1EDE2] flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-[#FAFAFA] border-b-2 border-[#B20000] px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={logoImg}
              alt="Jacaré"
              className="w-[50px] h-[50px] object-contain scale-x-[-1]"
            />
          </div>
          <h1 className="text-lg md:text-xl font-semibold">FatecBot</h1>
        </div>

        <button className="bg-[#B20000] hover:bg-[#7D0000] text-white px-3 md:px-4 py-2 rounded-md flex items-center gap-2 text-sm md:text-base">
          Área Restrita <span>→</span>
        </button>
      </header>

      {/* MAIN */}
      <main className="flex flex-col md:flex-row flex-1">
        {/* ESQUERDA */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 py-10 md:py-0">
          <span className="text-[#B20000] text-sm font-semibold mb-2">
            SECRETARIA ACADÊMICA DIGITAL
          </span>

          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
            Secretaria Acadêmica <br />
            na palma da mão.
          </h2>

          <p className="text-gray-600 mb-6 max-w-md">
            Tire dúvidas sobre calendário, matrícula, estágio e regulamento sem
            sair de casa. Disponível 24h, sem cadastro.
          </p>

          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[#B20000] hover:bg-[#7D0000] text-white px-5 py-3 rounded-md w-fit flex items-center gap-2"
          >
            💬 Iniciar Atendimento
          </button>
        </div>

        {/* DIREITA */}
        <div className="w-full md:w-1/2 bg-[#E9E4D8] flex items-center justify-center py-16 md:py-0 relative">
          <div className="relative flex items-center justify-center">
            {/* Cards (mais espaçados no mobile) */}
            <div className="absolute top-2 right-2 md:top-10 md:right-10 bg-white px-2 md:px-3 py-1 rounded-md shadow text-xs md:text-sm rotate-2">
              📅 Matrícula aberta
            </div>

            <div className="absolute top-32 left-2 md:top-40 md:left-10 bg-white px-2 md:px-3 py-1 rounded-md shadow text-xs md:text-sm -rotate-2">
              📆 Calendário 2026
            </div>

            <div className="absolute bottom-2 right-6 md:bottom-10 md:right-20 bg-white px-2 md:px-3 py-1 rounded-md shadow text-xs md:text-sm rotate-1">
              🎓 Estágio: dúvidas
            </div>

            {/* Jacaré (MAIOR no mobile) */}
            <img
              src={jacareImg}
              alt="Jacaré grande"
              className="w-[340px] md:w-[700px] object-contain"
            />
          </div>

          {/* Logo Fatec (mais pra baixo no mobile) */}
          <img
            src={fatecImg}
            alt="Fatec"
            className="absolute bottom-0 md:bottom-6 right-4 md:right-6 w-32 md:w-40 opacity-90"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
