"use client";

import React, { useEffect, useState, useCallback } from "react";
import { GoCalendar, GoAlert } from "react-icons/go";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/services/axiosServices";

interface Desafio {
  id?: number;
  name: string;
  endDate: string;
  status: string;
}

interface DesafiosResponse {
  data: Desafio[];
  total: number;
  page: number;
  limit: number;
}

const DesafiosEncerrando: React.FC = () => {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const traduzirStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      ACTIVE: "Ativo",
      IN_EVALUATION: "Em Avaliação",
      CLOSED: "Encerrado",
      DRAFT: "Rascunho",
    };
    return statusMap[status] || status;
  };

  const fetchDesafios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<DesafiosResponse>("/dashboard/expiring-soon", {
        params: { page: currentPage, limit },
        headers: { accept: "application/json" },
      });

      setDesafios(data.data || []);
      setTotalPages(Math.ceil(data.total / data.limit || 1));
    } catch {
      setError("Erro ao carregar desafios");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchDesafios();
  }, [fetchDesafios]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
        <p className="text-gray-500 dark:text-gray-300">Carregando desafios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-1 border-l-4 border-[#fb6514] dark:border-[#fb6514] shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <GoCalendar className="text-[#fb6514]" />
          Próximos Encerramentos de Desafios
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

      {desafios.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
          Nenhum desafio encerrando nos próximos 7 dias
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {desafios.map((d, index) => (
              <li
                key={d.id || index}
                className="flex justify-between items-center py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {d.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Status:{" "}
                    <span
                      className={`${
                        d.status === "ACTIVE"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {traduzirStatus(d.status)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 font-medium">
                  <GoAlert className="text-[#fb6514]" />
                  <span>
                    {new Date(d.endDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, idx) => (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === idx + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(idx + 1);
                        }}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesafiosEncerrando;
