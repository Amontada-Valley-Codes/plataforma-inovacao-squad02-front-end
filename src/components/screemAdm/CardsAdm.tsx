"use client";

import React, { useState, useEffect } from "react";
import { LuBuilding2, LuBrainCircuit, LuRocket, LuUsers } from "react-icons/lu";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { BsBuilding } from "react-icons/bs";
import { GoLightBulb } from "react-icons/go";
import api from "@/services/axiosServices";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  hasError?: boolean;
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

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  hasError,
}) => (
  <div
    className={`
      flex flex-col rounded-xl p-5 md:p-6 
      bg-white dark:bg-gray-800 border shadow-md hover:shadow-lg 
      ${hasError ? "border-red-500" : "border-[#fb6514]"} border-l-4
    `}
  >
    <div
      className={`flex items-center justify-center w-10 h-10 mb-3 rounded-lg ${
        hasError ? "bg-red-100" : "bg-[#fb6514]/10"
      } dark:bg-gray-700`}
    >
      <span
        className={`text-lg ${hasError ? "text-red-500" : "text-[#fb6514]"}`}
      >
        {icon}
      </span>
    </div>
    <div className="flex flex-col mt-2">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </span>
      <h4 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
        {hasError ? "—" : value.toLocaleString("pt-BR")}
      </h4>
      {hasError && (
        <span className="text-xs text-red-500 mt-1">Erro ao carregar</span>
      )}
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
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

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
    <p className="text-red-600 dark:text-red-400 font-semibold">{message}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
      Verifique o console (F12) para mais detalhes
    </p>
  </div>
);

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

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (url: string, metricName: string) => {
      try {
        const res = await api.get(url);
        return { value: res.data?.total ?? 0, error: false };
      } catch {
        setErrors((prev) => ({ ...prev, [metricName]: true }));
        return { value: 0, error: true };
      }
    };

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setGlobalError(null);
        setErrors({});

        const results = await Promise.all([
          fetchData("/dashboard/companies?page=1&limit=1", "empresas"),
          fetchData("/dashboard/startups?page=1&limit=10", "startups"),
          fetchData(
            "/dashboard/challenges/private?page=1&limit=10",
            "desafiosPrivados"
          ),
          fetchData(
            "/dashboard/challenges/public?page=1&limit=10",
            "desafiosPublicos"
          ),
          fetchData("/dashboard/challenges?page=1&limit=10", "todosOsDesafios"),
          fetchData("/dashboard/users?page=1&limit=10", "totalUsuarios"),
          fetchData(
            "/dashboard/challenges/completed?page=1&limit=10",
            "atividadesConcluidas"
          ),
          fetchData("/dashboard/matchs?page=1&limit=10", "matches"),
        ]);

        const [
          empresas,
          startups,
          desafiosPrivados,
          desafiosPublicos,
          todosOsDesafios,
          totalUsuarios,
          atividadesConcluidas,
          matches,
        ] = results;

        setMetricsData({
          empresas: empresas.value,
          startups: startups.value,
          desafiosPrivados: desafiosPrivados.value,
          desafiosPublicos: desafiosPublicos.value,
          todosOsDesafios: todosOsDesafios.value,
          totalUsuarios: totalUsuarios.value,
          atividadesConcluidas: atividadesConcluidas.value,
          matches: matches.value,
        });
      } catch {
        setGlobalError("Erro ao carregar dados do servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (globalError) return <ErrorMessage message={globalError} />;

  const metrics = [
    {
      title: "Empresas",
      value: metricsData.empresas,
      icon: <BsBuilding />,
      key: "empresas",
    },
    {
      title: "Startups",
      value: metricsData.startups,
      icon: <LuBuilding2 />,
      key: "startups",
    },
    {
      title: "Desafios Privados",
      value: metricsData.desafiosPrivados,
      icon: <GoLightBulb />,
      key: "desafiosPrivados",
    },
    {
      title: "Desafios Públicos",
      value: metricsData.desafiosPublicos,
      icon: <GoLightBulb />,
      key: "desafiosPublicos",
    },
    {
      title: "Todos os Desafios",
      value: metricsData.todosOsDesafios,
      icon: <IoExtensionPuzzleOutline />,
      key: "todosOsDesafios",
    },
    {
      title: "Total de Usuários",
      value: metricsData.totalUsuarios,
      icon: <LuUsers />,
      key: "totalUsuarios",
    },
    {
      title: "Atividades Concluídas",
      value: metricsData.atividadesConcluidas,
      icon: <LuBrainCircuit />,
      key: "atividadesConcluidas",
    },
    {
      title: "Total de Match's",
      value: metricsData.matches,
      icon: <LuRocket />,
      key: "matches",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
          icon={metric.icon}
          title={metric.title}
          value={metric.value}
          hasError={errors[metric.key]}
        />
      ))}
    </div>
  );
};

export default CardsAdm;
