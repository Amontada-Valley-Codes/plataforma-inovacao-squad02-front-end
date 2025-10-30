  'use client'
  import { useState, useEffect } from "react";
  import PubliCard from "@/components/public-page/public-card";
  import api from "@/services/axiosServices";

  type DesafioAPI = {
    id: string;
    companyId: string;
    userId: string;
    name: string;
    theme: string;
    description: string;
    startDate: string;
    endDate: string;
    visibility: "PUBLIC" | "INTERNAL";
    status: "ACTIVE" | "INACTIVE";
    funnelStage: string;
    createdAt: string;
    updatedAt: string;
  };

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

  export default function Desafios() {
    const [desafios, setDesafios] = useState<DesafioParaCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchDesafios = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get("/public/challenges", {
            params: { page: 1, limit: 3 }
          });
          const desafiosData: DesafioAPI[] = response.data?.data || [];
          const desafiosConvertidos: DesafioParaCard[] = desafiosData
            .filter((desafio) => desafio.visibility === "PUBLIC")
            .map((desafio) => ({
              id: desafio.id,
              nome: desafio.name,
              tema: desafio.theme,
              descricao: desafio.description,
              privacidade: "PUBLICO",
              dataInicio: desafio.startDate,
              dataFim: desafio.endDate,
              status: desafio.status === "ACTIVE" ? "ATIVO" : "INATIVO",
              createdAt: desafio.createdAt,
              updatedAt: desafio.updatedAt
            }));
          setDesafios(desafiosConvertidos.length > 0 ? desafiosConvertidos : []);
        } catch (error: any) {
          let errorMsg = "Erro ao carregar desafios";
          if (error.response?.status === 500) errorMsg = "Servidor com problemas internos (500)";
          else if (error.response?.status === 404) errorMsg = "Endpoint não encontrado (404)";
          else if (error.response?.status === 403) errorMsg = "Sem permissão para acessar (403)";
          else if (error.message?.includes("Network Error")) errorMsg = "Servidor offline ou não encontrado";
          setError(`${errorMsg}. Usando dados de exemplo.`);
          setDesafios([]);
        } finally {
          setLoading(false);
        }
      };
      fetchDesafios();
    }, []);

    if (loading) {
      return (
        <div className="w-full flex flex-col items-center justify-center px-6 md:px-12 py-20">
          <h2 className="font-semibold text-2xl md:text-4xl text-center mb-4">
            Desafios <span className="text-warning-500">Lançados</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 text-base md:text-xl">
            Carregando desafios públicos...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center justify-center px-6 md:px-12 py-20">
        <h2 className="font-semibold text-2xl md:text-4xl text-center mb-4">
          Desafios <span className="text-warning-500">Lançados</span>
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-12 text-base md:text-xl max-w-2xl">
          Veja desafios lançados publicamente por startups
        </p>

        {error && (
          <div className="mb-10 text-center">
            <div className="text-sm text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 px-6 py-3 rounded-lg max-w-md mx-auto">
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-10xl">
          {desafios.slice(0, 3).map((desafio) => (
            <PubliCard key={desafio.id} desafio={desafio} />
          ))}
        </div>

        <div className="mt-16 border-t-2 border-warning-500 pt-5 flex justify-center w-full">
          <button className="bg-warning-500 hover:shadow-lg transition-all duration-300 transform hover:scale-100 hover:bg-warning-400 text-white py-2 px-4 rounded-md text-base md:text-lg font-medium">
            <a href="/desafios-publicos">Ver Mais Desafios</a>
          </button>
        </div>
      </div>
    );
  }
