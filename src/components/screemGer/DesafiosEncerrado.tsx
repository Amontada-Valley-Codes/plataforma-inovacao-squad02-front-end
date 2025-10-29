"use client";

import React from "react";
import { GoCalendar, GoAlert } from "react-icons/go";

const DesafiosEncerrando: React.FC = () => {
  const desafios = [
    {
      id: 1,
      nome: "Automatização de Processos Internos",
      dataFim: "2025-11-02",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Redução de Desperdício de Energia",
      dataFim: "2025-11-05",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Melhoria da Experiência do Cliente",
      dataFim: "2025-11-10",
      status: "Em Avaliação",
    },
    {
      id: 4,
      nome: "Integração com Startups Sustentáveis",
      dataFim: "2025-11-12",
      status: "Ativo",
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <GoCalendar className="text-[#fb6514]" />
          Próximos Encerramentos de Desafios
        </h3>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          Última atualização: 27/10/2025
        </span>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {desafios.map((d) => (
          <li
            key={d.id}
            className="flex justify-between items-center py-3 text-sm"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {d.nome}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Status:{" "}
                <span
                  className={`${
                    d.status === "Ativo"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {d.status}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 font-medium">
              <GoAlert className="text-[#fb6514]" />
              <span>
                {new Date(d.dataFim).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesafiosEncerrando;
