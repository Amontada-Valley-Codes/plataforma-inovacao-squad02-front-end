"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/desafio/card";
import { Lightbulb } from "lucide-react";
import api from "@/services/axiosServices";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Desafio = {
  id: string;
  nome: string;
  tema: string;
  descricao: string;
  privacidade: "PUBLICO" | "INTERNO";
  dataInicio: string;
  dataFim: string;
  status: string;
};

export default function Page() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDesafiosPublicos = async () => {
      setLoading(true);
      try {
        const response = await api.get("/public/challenges", {
          params: {
            page: currentPage,
            limit: 9,
          },
        });

        const { data, total, limit } = response.data;
        setDesafios(data);
        setTotalPages(Math.ceil(total / limit));
      } catch (error) {
        console.error("Erro ao buscar desafios públicos:", error);
        setError("Erro ao carregar desafios públicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesafiosPublicos();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-3 py-5 rounded-2xl">
        <div className="flex justify-between items-center">
          <p className="text-2xl">Desafios Públicos</p>
        </div>
      </div>

      <div className="px-6 pb-8">
        {error ? (
          <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        ) : !loading && desafios.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-dashed border-orange-200">
            <Lightbulb className="w-16 h-16 mx-auto text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Nenhum desafio público encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-300">
              Aguarde novos desafios públicos serem lançados!
            </p>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {desafios.map((desafio) => (
                <Card
                  key={desafio.id}
                  id={desafio.id}
                  title={desafio.nome}
                  description={desafio.descricao}
                  status={desafio.status}
                  startDate={new Date(desafio.dataInicio).toLocaleDateString()}
                  endDate={
                    desafio.dataFim
                      ? new Date(desafio.dataFim).toLocaleDateString()
                      : ""
                  }
                  theme={desafio.tema}
                  visibility={
  desafio.privacidade === "PUBLICO" ? "PUBLIC" : "INTERNAL"
}
                  funnelStage=""
                  isAdmin={false} 
                />
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, idx) => (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
