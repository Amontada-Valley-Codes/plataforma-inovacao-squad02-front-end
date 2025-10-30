"use client";

import React, { useEffect, useState } from "react";
import { GoCalendar } from "react-icons/go";
import api from "@/services/axiosServices";

interface Etapa {
  stage: string;
  total: number;
}

interface FunilResponse {
  data: Etapa[];
  total: number;
  page: number;
  limit: number;
}

const DesafiosFunil: React.FC = () => {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const traducoes: Record<string, string> = {
    IDEA_GENERATION: "Geração de Ideias",
    PRE_SCREENING: "Pré-Triagem",
    IDEATION: "Ideação",
    DETAILED_SCREENING: "Triagem Detalhada",
    EXPERIMENTATION: "Experimentação",
    VALIDATION: "Validação",
    EXECUTION: "Execução",
  };

  useEffect(() => {
    const fetchEtapas = async () => {
      try {
        const { data } = await api.get<FunilResponse>("/dashboard/challenges/funnel", {
          params: { page: 1, limit: 10 },
          headers: { accept: "application/json" },
        });

        setEtapas(data.data || []);
      } catch {
        setError("Erro ao carregar dados do gráfico");
      } finally {
        setLoading(false);
      }
    };

    fetchEtapas();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-300">Carregando gráfico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const maxTotal = Math.max(...etapas.map((e) => e.total), 1);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-1 border-l-4 border-[#fb6514] dark:border-[#fb6514] shadow-md">
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

      {etapas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
          Nenhum dado disponível
        </p>
      ) : (
        <div className="space-y-3">
          {etapas.map((etapa) => {
            const nomeEmPortugues =
              traducoes[etapa.stage] || etapa.stage.replaceAll("_", " ");
            const percentual = (etapa.total / maxTotal) * 100;

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
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DesafiosFunil;
