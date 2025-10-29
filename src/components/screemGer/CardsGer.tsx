"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuLightbulb, LuUsers } from "react-icons/lu";
import { BiWrench } from "react-icons/bi";
import api from "@/services/axiosServices";



interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

interface MetricsData {
  pocsRealizadas: number;
  ideiasSubmetidas: number;
  desafiosAtivos: number;
  usuariosEmpresa: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value }) => (
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

export const CardsGestor: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsData>({
    pocsRealizadas: 0,
    ideiasSubmetidas: 0,
    desafiosAtivos: 0,
    usuariosEmpresa: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [resPocs, resIdeias, resDesafios, resUsuarios] =
          await Promise.all([
            api.get(`/dashboard/pocs?page=1&limit=10`),
            api.get(`/dashboard/ideas?page=1&limit=10`),
            api.get(`/dashboard/challenges/active`),
            api.get(`/dashboard/users/total`),
          ]);

        const newMetrics: MetricsData = {
          pocsRealizadas: resPocs.data?.data?.[0]?.total ?? 0,
          ideiasSubmetidas: resIdeias.data?.data?.[0]?.total ?? 0,
          desafiosAtivos: resDesafios.data?.total ?? 0, // /active retorna total direto
          usuariosEmpresa: resUsuarios.data?.total ?? 0, // /total retorna total direto
        };

        console.log("📊 Dados do dashboard:", newMetrics);
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
        {Array.from({ length: 4 }).map((_, i) => (
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
    {
      title: "POCs Realizadas",
      value: metricsData.pocsRealizadas,
      icon: <LuLightbulb />,
    },
    {
      title: "Ideias Submetidas",
      value: metricsData.ideiasSubmetidas,
      icon: <LuLightbulb />,
    },
    {
      title: "Desafios Ativos",
      value: metricsData.desafiosAtivos,
      icon: <BiWrench />,
    },
    {
      title: "Usuários da Empresa",
      value: metricsData.usuariosEmpresa,
      icon: <LuUsers />,
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

export default CardsGestor;
