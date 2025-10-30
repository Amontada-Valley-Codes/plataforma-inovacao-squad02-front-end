"use client";

import React from "react";
import { LuLink, LuRocket } from "react-icons/lu";

interface MatchItemProps {
  startupName: string;
  challengeName: string;
  date: string;
}

const MatchItem: React.FC<MatchItemProps> = ({ startupName, challengeName, date }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 px-2 -mx-2">
    <div className="flex items-center space-x-3">
      <LuRocket className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{startupName}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Desafio: {challengeName}</p>
      </div>
    </div>
    <span className="text-xs text-gray-400">{date}</span>
  </div>
);

const RecentMatchesList: React.FC = () => {
  const recentMatches = [
    { startupName: "LogiTech Solutions", challengeName: "Logística de Última Milha", date: "Há 2 dias" },
    { startupName: "GreenFuture AI", challengeName: "Redução de Consumo Energético", date: "Há 5 dias" },
    { startupName: "ClientBot 360", challengeName: "Interface de Atendimento com IA", date: "1 semana atrás" },
    { startupName: "BioCycle", challengeName: "Novos Usos para Resíduos", date: "2 semanas atrás" },
  ];

  return (
    <div className="rounded-xl p-6 bg-white dark:bg-gray-800 border-1 border-l-4 border-[#fb6514] dark:border-[#fb6514] shadow-md h-full">
      <div className="flex items-center mb-6">
        <LuLink className="w-6 h-6 mr-3 text-[#fb6514]" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Últimas Conexões (Startup Match)</h3>
      </div>

      <div className="space-y-1">
        {recentMatches.map((match, idx) => (
          <MatchItem key={idx} {...match} />
        ))}
      </div>
    </div>
  );
};

export default RecentMatchesList;
