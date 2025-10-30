"use client";

import React from "react";
import { LuTarget, LuEye, LuLink, LuTrendingUp } from "react-icons/lu";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, suffix }) => (
  <div className="flex flex-col rounded-xl p-5 md:p-6 bg-white dark:bg-gray-800 border border-[#fb6514] border-l-4 shadow-md hover:shadow-lg">
    <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-[#fb6514]/10">
      <span className="text-lg text-[#fb6514]">{icon}</span>
    </div>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
    <h4 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
      {value.toLocaleString("pt-BR")}
      {suffix && <span className="text-base font-bold ml-1">{suffix}</span>}
    </h4>
  </div>
);

const ManagerDashboardCards: React.FC = () => {
  const metricsData = {
    desafiosAtivos: 5,
    avaliacoesPendentes: 23,
    taxaDeMatch: 45,
    taxaDeSucesso: 8,
  };

  const metrics: MetricCardProps[] = [
    { title: "Desafios Ativos", value: metricsData.desafiosAtivos, icon: <LuTarget className="w-5 h-5" /> },
    { title: "Avaliações Pendentes", value: metricsData.avaliacoesPendentes, icon: <LuEye className="w-5 h-5" /> },
    { title: "Taxa de Match (Desafio/Startup)", value: metricsData.taxaDeMatch, icon: <LuLink className="w-5 h-5" />, suffix: "%" },
    { title: "Taxa de Sucesso (Ideia > POC)", value: metricsData.taxaDeSucesso, icon: <LuTrendingUp className="w-5 h-5" />, suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
};

export default ManagerDashboardCards;
