"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuBuilding2, LuBrainCircuit, LuRocket, LuUsers } from "react-icons/lu";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { BsBuilding } from "react-icons/bs";
import { GoLightBulb } from "react-icons/go";
import api from "@/services/axiosServices";

const HIGHLIGHT_COLOR = "#fb6514";


interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

interface MetricsData {
  empresas: number;
  startups: number;
  desafiosPrivados: number;
  desafiosPublicos: number;
  todosOsDesafios: number;
  totalUsuarios: number;
  atividadesConcluidas: number;
  matches: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value }) => {
  return (
    <div
      className={`
        flex flex-col rounded-xl p-5 md:p-6 transition-all duration-300 
        bg-white dark:bg-gray-800 border shadow-md hover:shadow-lg 
        border-[#fb6514] border-l-4 dark:border-l-[#fb6514]
        hover:scale-[1.01]
      `}
    >
      <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-[#fb6514]/10 dark:bg-gray-700">
        <span className="text-lg text-[#fb6514]">{icon}</span>
      </div>

      <div className="flex flex-col mt-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
          {value.toLocaleString("pt-BR")}
        </h4>
      </div>
    </div>
  );
};

export const CardsAdm: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsData>({
    empresas: 0,
    startups: 0,
    desafiosPrivados: 0,
    desafiosPublicos: 0,
    todosOsDesafios: 0,
    totalUsuarios: 0,
    atividadesConcluidas: 0,
    matches: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          resCompanies,
          resPrivateChallenges,
          resPublicChallenges,
          resUsers,
          resAllChallenges,
          resStartups, // Corrigido aqui
        ] = await Promise.all([
          api.get('/dashboard/companies?page=1&limit=1'),
          api.get('/dashboard/challenges/private?page=1&limit=10'),
          api.get('/dashboard/challenges/public?page=1&limit=10'),
          api.get('/dashboard/users?page=1&limit=10'),
          api.get('/dashboard/challenges?page=1&limit=10'),
          api.get('/dashboard/startups?page=1&limit=10'),
          api.get('/dashboard/completed-activities?page=1&limit=10'),
          api.get('/dashboard/matchs?page=1&limit=10'),
        ]);

        const newMetrics: MetricsData = {
          empresas: resCompanies.data?.total ?? 0,
          startups: resStartups.data?.total ?? 0,
          desafiosPrivados: resPrivateChallenges.data?.total ?? 0,
          desafiosPublicos: resPublicChallenges.data?.total ?? 0,
          todosOsDesafios: resAllChallenges.data?.total ?? 0,
          totalUsuarios: resUsers.data?.total ?? 0,
          atividadesConcluidas: 0,
          matches: 0,
        };

        console.log("Métricas carregadas:", newMetrics);
        setMetricsData(newMetrics);
      } catch (err: any) {
        console.error("Erro ao buscar métricas:", err);
        setError("Erro ao carregar dados do servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl p-5 md:p-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="w-11 h-11 mb-4 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const metrics = [
    { title: "Empresas", value: metricsData.empresas, icon: <BsBuilding /> },
    { title: "Startups", value: metricsData.startups, icon: <LuBuilding2 /> },
    {
      title: "Desafios Privados",
      value: metricsData.desafiosPrivados,
      icon: <GoLightBulb />,
    },
    {
      title: "Desafios Públicos",
      value: metricsData.desafiosPublicos,
      icon: <GoLightBulb />,
    },
    {
      title: "Todos os Desafios",
      value: metricsData.todosOsDesafios,
      icon: <IoExtensionPuzzleOutline />,
    },
    {
      title: "Total de Usuários",
      value: metricsData.totalUsuarios,
      icon: <LuUsers />,
    },
    {
      title: "Atividades Concluídas",
      value: metricsData.atividadesConcluidas,
      icon: <LuBrainCircuit />,
    },
    {
      title: "Total de Match's",
      value: metricsData.matches,
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

export default CardsAdm;
