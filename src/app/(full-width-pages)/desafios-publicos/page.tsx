"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/Searchbar";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import PubliCard from "@/components/public-page/public-card";
import api from "@/services/axiosServices";

type DesafioParaCard = {
  id: string;
  nome: string;
  tema: string;
  descricao: string;
  privacidade: "PUBLICO" | "INTERNO";
  dataInicio: string;
  dataFim: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [desafios, setDesafios] = useState<DesafioParaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 9;

  const fetchDesafios = async (pageNumber = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/public/challenges", {
        params: { page: pageNumber, limit },
      });

      let desafiosData = response.data;
      if (desafiosData && desafiosData.data && Array.isArray(desafiosData.data)) {
        desafiosData = desafiosData.data;
      } else if (!Array.isArray(desafiosData)) {
        desafiosData = [];
      }

      const desafiosConvertidos: DesafioParaCard[] = desafiosData.map((desafio: any) => ({
        id: desafio.id,
        nome: desafio.name || "Sem nome",
        tema: desafio.theme || "Sem tema",
        descricao: desafio.description || "Sem descrição",
        privacidade: "PUBLICO",
        dataInicio: desafio.startDate,
        dataFim: desafio.endDate,
        status: desafio.status === "ACTIVE" ? "ATIVO" : "INATIVO",
        createdAt: desafio.createdAt,
        updatedAt: desafio.updatedAt,
      }));

      setDesafios((prev) => (append ? [...prev, ...desafiosConvertidos] : desafiosConvertidos));
      setHasMore(desafiosConvertidos.length === limit);
    } catch (error: any) {
      let errorMsg = "Erro ao carregar desafios públicos.";
      if (error.response?.status === 500) errorMsg = "Erro interno do servidor (500)";
      else if (error.response?.status === 404) errorMsg = "Endpoint não encontrado (404)";
      else if (error.response?.status === 403) errorMsg = "Sem permissão (403)";
      else if (error.message?.includes("Network Error")) errorMsg = "Servidor offline ou inacessível";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesafios(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchDesafios(nextPage, true);
    setPage(nextPage);
  };

  const filteredDesafios = desafios.filter(
    (desafio) =>
      desafio.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desafio.tema.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desafio.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && page === 1) {
    return (
      <div>
        <header className="flex min-h-screen items-center justify-center flex-col w-full relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center gap-2 absolute z-10 right-5 top-[env(safe-area-inset-top)] pt-5">
            <ThemeToggleButton />
          </div>
          <div className="flex-1 flex items-center justify-center flex-col px-4 pt-3">
            <Image
              src="/hivehub-logobranca.png"
              alt="Logo Hive Hub"
              width={260}
              height={200}
              className="dark:block hidden w-full max-w-[190px] md:max-w-[300px] h-auto"
            />
            <Image
              src="/hivehub-logopreto.png"
              alt="Logo Hive Hub"
              width={260}
              height={195}
              className="block dark:hidden w-full max-w-[190px] md:max-w-[300px] h-auto"
            />
          </div>
          <h2 className="dark:text-warning-25/80 text-[1.3em] pb-3 font-light italic text-center mt-4">
            Uma colmeia de ideias
          </h2>
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
          <div className="text-gray-600 dark:text-gray-400 text-center mt-4">Carregando desafios...</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-10 px-4 w-full max-w-6xl mx-auto">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-[265px] rounded-2xl border bg-gray-300 dark:bg-gray-700 animate-pulse"
              ></div>
            ))}
          </div>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="flex min-h-screen items-center justify-center flex-col w-full relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex-1 flex items-center justify-center flex-col px-4 pt-3">
          <Image
            src="/hivehub-logobranca.png"
            alt="Logo Hive Hub"
            width={260}
            height={200}
            className="dark:block hidden w-full max-w-[190px] md:max-w-[300px] h-auto"
          />
          <Image
            src="/hivehub-logopreto.png"
            alt="Logo Hive Hub"
            width={260}
            height={195}
            className="block dark:hidden w-full max-w-[190px] md:max-w-[300px] h-auto"
          />
        </div>

        <h2 className="dark:text-warning-25/80 text-[1.3em] pb-3 font-light italic text-center mt-4">
          Uma colmeia de ideias
        </h2>

        <SearchBar
          onSearch={(query) => {
            setSearchQuery(query);
          }}
        />

        {error && (
          <div className="mt-4 text-center">
            <div className="text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg max-w-md mx-auto">
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-10 px-4 w-full max-w-6xl mx-auto">
          {filteredDesafios.length > 0 ? (
            filteredDesafios.map((desafio) => (
              <PubliCard key={desafio.id} desafio={desafio} />
            ))
          ) : (
            <p className="text-black dark:text-white text-center p-4 col-span-full">
              {searchQuery
                ? "Nenhum desafio encontrado para sua busca"
                : "Nenhum desafio público disponível"}
            </p>
          )}
        </div>

        {hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-4 mb-10 px-6 py-2 bg-warning-50 text-black dark:text-white rounded-lg hover:bg-warning-60 disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Carregar mais"}
          </button>
        )}
      </header>
    </div>
  );
}
