"use client";
import React from "react";
// Ícones importados (mantidos)
import { LuBuilding2, LuBrainCircuit, LuRocket, LuUsers } from "react-icons/lu"; 
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { BsBuilding } from "react-icons/bs";
import { GoLightBulb } from "react-icons/go";
import { BiWrench } from "react-icons/bi"; 

// A cor de destaque é #fb6514
const HIGHLIGHT_COLOR = '#fb6514'; 

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value }) => {
  return (
    // 1. APLICAÇÃO DA COR NA BORDA (Corrigida com HEX fixo)
    // Usando o valor fixo dentro dos colchetes: '[#fb6514]'
    <div className={`flex flex-col rounded-xl p-5 md:p-6 transition-all duration-300 bg-white dark:bg-gray-800 border shadow-md hover:shadow-lg border-[#fb6514] border-l-4 dark:border-l-[#fb6514]`}>
      
      {/* 2. APLICAÇÃO DA COR NO FUNDO DO ÍCONE (Corrigida com HEX fixo) */}
      <div className="flex items-center justify-center w-11 h-11 mb-4 rounded-lg bg-[#fb6514]/10 dark:bg-gray-700">
        
        {/* 3. APLICAÇÃO DA COR NO ÍCONE (Corrigida com HEX fixo) */}
        <span className="text-xl text-[#fb6514]">
          {icon}
        </span>
      </div>

      <div className="flex flex-col mt-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
          {value}
        </h4>
      </div>
    </div>
  );
};

export const CardsAdm = () => {
  const metrics = [
    {
      title: "Empresas",
      value: 35,
      icon: <BsBuilding />,
    },
    {
      title: "Startups",
      value: 30,
      icon: <LuBuilding2 />,
    },
    {
      title: "Desafios Privados",
      value: 35,
      icon: <GoLightBulb />,
    },
    {
      title: "Desafios Públicos",
      value: 27,
      icon: <IoExtensionPuzzleOutline />,
    },
    {
      title: "Total de Usuários",
      value: 480, 
      icon: <LuUsers />, 
    },
    {
      title: "Soluções Enviadas",
      value: 125, 
      icon: <BiWrench />, 
    },
    {
      title: "Atividades Concluídas", 
      value: 180, 
      icon: <LuBrainCircuit />,
    },
    {
      title: "Total de Match's", 
      value: 15,
      icon: <LuRocket />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title + index}
          icon={metric.icon}
          title={metric.title}
          value={metric.value}
        />
      ))}
    </div>
  );
};