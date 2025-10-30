"use client";

import React, { useState, useEffect } from "react";
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
  <div className="flex flex-col rounded-xl p-5 md:p-6 bg-white dark:bg-gray-800 border border-[#fb6514] border-l-4 shadow-md hover:shadow-lg">
    <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-[#fb6514]/10">
      <span className="text-lg text-[#fb6514]">{icon}</span>
    </div>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {title}
    </span>
    <h4 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
      {value.toLocaleString("pt-BR")}
    </h4>
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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [pocs, ideias, desafios, totalUsers] = await Promise.allSettled([
          api.get("/dashboard/pocs"),
          api.get("/dashboard/ideas"),
          api.get("/dashboard/challenges/active"),
          api.get("/dashboard/users/by-company"),
        ]);

        setMetricsData({
          pocsRealizadas:
            pocs.status === "fulfilled" ? pocs.value.data.total ?? 0 : 0,
          ideiasSubmetidas:
            ideias.status === "fulfilled" ? ideias.value.data.total ?? 0 : 0,
          desafiosAtivos:
            desafios.status === "fulfilled" ? desafios.value.data.total ?? 0 : 0,
          usuariosEmpresa:
            totalUsers.status === "fulfilled"
              ? totalUsers.value.data.totalUsers ?? 0
              : 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl p-5 md:p-6 bg-gray-100 dark:bg-gray-800 animate-pulse"
          >
            <div className="w-10 h-10 mb-3 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16" />
          </div>
        ))}
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
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
};

export default CardsGestor;
