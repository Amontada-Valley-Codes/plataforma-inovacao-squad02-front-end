"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoCalendar } from "react-icons/go";
import api from "@/services/axiosServices";

interface Etapa {
  stage: string;
  total: number;
}

const DesafiosEncerrando: React.FC = () => {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const traducoes: Record<string, string> = {
    IDEA_GENERATION: "Geração de Ideias",
    IDEATION: "Ideação",
    DETAILED_SCREENING: "Triagem Detalhada",
    PRE_SCREENING: "Pré-Triagem",
  };

  useEffect(() => {
    const fetchEtapas = async () => {
      try {
        const response = await api.get(
          "/dashboard/count-by-stage",
          { headers: { Accept: "application/json" } }
        );
        setEtapas(response.data.data || []);
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados do gráfico");
      } finally {
        setLoading(false);
      }
    };

    fetchEtapas();
  }, []);

  if (loading)
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-300">
          Carregando gráfico...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const maxTotal = Math.max(...etapas.map((e) => e.total));

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-1 border-l-4 border-[#fb6514] dark:border-gray-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <GoCalendar className="text-[#fb6514]" />
          Desafios por Etapa do Funil
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Última atualização:{" "}
          {new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="space-y-3">
        {etapas.map((etapa) => {
          const nomeEmPortugues =
            traducoes[etapa.stage] || etapa.stage.replaceAll("_", " ");

          return (
            <div key={etapa.stage}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {nomeEmPortugues}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {etapa.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-[#fb6514] h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(etapa.total / maxTotal) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesafiosEncerrando;
