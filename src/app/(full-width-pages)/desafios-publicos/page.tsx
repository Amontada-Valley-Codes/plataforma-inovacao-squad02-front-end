"use client";

import Image from "next/image"
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/Searchbar";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import PubliCard from "@/components/public-page/public-card";
import api from "@/services/axiosServices";

type DesafioAPI = {
  id: string;
  name: string;
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  visibility: "PUBLIC" | "INTERNAL";
  status: string;
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

export default function Page(){
  const [searchQuery, setSearchQuery] = useState("");
  const [desafios, setDesafios] = useState<DesafioParaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesafios = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("🎯 Buscando desafios públicos...");
        
        // 🔹 TENTAR DIFERENTES ENDPOINTS
        let response;
        let endpointUsado = "";
        
        try {
          // Primeira tentativa: endpoint público
          endpointUsado = "/public/challenges";
          response = await api.get(endpointUsado);
          console.log("✅ Sucesso no endpoint público:", response.data);
        } catch (error1: any) {
          console.log("❌ Endpoint público falhou, tentando interno...");
          
          // Segunda tentativa: endpoint interno (pode ter permissões diferentes)
          try {
            endpointUsado = "/internal/challenges";
            response = await api.get(endpointUsado, {
              params: {
                page: 1,
                limit: 10,
              },
            });
            console.log("✅ Sucesso no endpoint interno:", response.data);
          } catch (error2: any) {
            console.log("❌ Ambos endpoints falharam");
            throw new Error("Nenhum endpoint funcionou");
          }
        }

        // 🔹 PROCESSAR A RESPOSTA
        let desafiosData = response.data;
        
        // Se a resposta tem estrutura { data: [...] } (como na página interna)
        if (desafiosData && desafiosData.data && Array.isArray(desafiosData.data)) {
          console.log("📦 Estrutura: { data: [...] }");
          desafiosData = desafiosData.data;
        }
        // Se é array direto
        else if (Array.isArray(desafiosData)) {
          console.log("📦 Estrutura: Array direto");
          // Já é array, não precisa fazer nada
        }
        // Se é um objeto único
        else if (desafiosData && typeof desafiosData === 'object') {
          console.log("📦 Estrutura: Objeto único");
          desafiosData = [desafiosData]; // Converte para array
        }
        else {
          console.warn("❌ Estrutura não reconhecida, usando array vazio");
          desafiosData = [];
        }

        console.log(`📋 ${desafiosData.length} desafio(s) processado(s):`, desafiosData);

        // 🔹 CONVERSÃO PARA O FORMATO DO CARD
        const desafiosConvertidos: DesafioParaCard[] = desafiosData
          .filter((desafio: any) => desafio && typeof desafio === 'object')
          .map((desafio: any) => {
            // Determinar se é formato em inglês ou português
            const nome = desafio.nome || desafio.name || 'Desafio sem nome';
            const tema = desafio.tema || desafio.theme || 'Tema não definido';
            const descricao = desafio.descricao || desafio.description || 'Descrição não disponível';
            
            // Verificar se o desafio é público (só mostrar públicos)
            const visibility = desafio.visibility || desafio.privacidade;
            const isPublico = visibility === 'PUBLIC' || visibility === 'PUBLICO';
            
            // Se não for público, não incluir
            if (!isPublico) {
              console.log(`🚫 Desafio "${nome}" não é público - ignorando`);
              return null;
            }

            return {
              id: desafio.id || Math.random().toString(),
              nome: nome,
              tema: tema,
              descricao: descricao,
              privacidade: "PUBLICO",
              dataInicio: desafio.dataInicio || desafio.startDate || new Date().toISOString(),
              dataFim: desafio.dataFim || desafio.endDate || new Date().toISOString(),
              status: (desafio.status === 'ACTIVE' || desafio.status === 'ATIVO') ? 'ATIVO' : 'INATIVO',
              createdAt: desafio.createdAt || new Date().toISOString(),
              updatedAt: desafio.updatedAt || new Date().toISOString()
            };
          })
          .filter(Boolean); // Remove nulls

        console.log("🔄 Desafios convertidos:", desafiosConvertidos);
        
        // 🔍 Verificar se o "Casa Janjão" está na lista
        const casaJanjao = desafiosConvertidos.find(d => 
          d.nome && d.nome.toLowerCase().includes('casa janj')
        );
        if (casaJanjao) {
          console.log("🎉 Casa Janjão encontrado!", casaJanjao);
        } else {
          console.log("🔍 Casa Janjão NÃO encontrado nos dados processados");
        }

        if (desafiosConvertidos.length > 0) {
          setDesafios(desafiosConvertidos);
        } else {
          console.log("ℹ️ Nenhum desafio público encontrado - usando dados de exemplo");
          setDesafios(getDesafiosRealistas());
        }

      } catch (error: any) {
        console.error("💥 Erro completo:", error);
        
        // Mensagem de erro mais específica
        let errorMsg = "Erro ao carregar desafios";
        if (error.response?.status === 500) {
          errorMsg = "Servidor com problemas internos (500)";
        } else if (error.response?.status === 404) {
          errorMsg = "Endpoint não encontrado (404)";
        } else if (error.response?.status === 403) {
          errorMsg = "Sem permissão para acessar (403)";
        } else if (error.message?.includes('Network Error')) {
          errorMsg = "Servidor offline ou não encontrado";
        }
        
        setError(`${errorMsg}. Usando dados de exemplo.`);
        setDesafios(getDesafiosRealistas());
      } finally {
        setLoading(false);
      }
    };

    fetchDesafios();
  }, []);

  // 🔹 Dados realistas de fallback
  const getDesafiosRealistas = (): DesafioParaCard[] => [
    {
      id: "1",
      nome: "Automação de Processos Internos",
      tema: "Amontada Valley",
      descricao: "Buscando inovações para automatizar processo manuais porque eu quero ver coisas novas",
      privacidade: "PUBLICO",
      dataInicio: "2025-06-13T00:00:00.000Z",
      dataFim: "2025-12-21T23:59:59.000Z",
      status: "ATIVO",
      createdAt: "2025-01-01T10:00:00.000Z",
      updatedAt: "2025-01-01T10:00:00.000Z"
    },
    {
      id: "2",
      nome: "Gestão Inteligente de Dados",
      tema: "Empresa Braga Nunes",
      descricao: "Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito",
      privacidade: "PUBLICO",
      dataInicio: "2025-01-01T00:00:00.000Z",
      dataFim: "2025-12-12T23:59:59.000Z",
      status: "ATIVO",
      createdAt: "2025-01-01T10:00:00.000Z",
      updatedAt: "2025-01-01T10:00:00.000Z"
    },
    {
      id: "3",
      nome: "Sustentabilidade no Setor Industrial",
      tema: "Ypê",
      descricao: "Projetos voltados para inovação sustentável para uma ecologia bem inovadora e maneira",
      privacidade: "PUBLICO",
      dataInicio: "2025-02-15T00:00:00.000Z",
      dataFim: "2025-05-05T23:59:59.000Z",
      status: "INATIVO",
      createdAt: "2025-01-01T10:00:00.000Z",
      updatedAt: "2025-01-01T10:00:00.000Z"
    }
  ];

  // 🔹 Filtrar desafios pelo nome, tema ou descrição
  const filteredDesafios = desafios.filter(desafio =>
    desafio.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    desafio.tema.toLowerCase().includes(searchQuery.toLowerCase()) ||
    desafio.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <header className="flex min-h-screen items-center justify-center flex-col content-center w-full relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center gap-2 2xsm:gap-3 absolute z-10 right-5 top-[env(safe-area-inset-top)] pt-5">
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

          <div className="text-gray-600 dark:text-gray-400 text-center mt-4">
            🔄 Carregando desafios...
          </div>

          <div className="flex gap-1 md:gap-5 items-center justify-center flex-wrap pt-4 pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full max-w-[350px] h-[265px] rounded-2xl border bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            ))}
          </div>
        </header>
      </div>
    );
  }

  return(
    <div>
      <header className="flex min-h-screen items-center justify-center flex-col content-center w-full relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {/* <div className="flex items-center gap-2 2xsm:gap-3 absolute z-10 right-5 top-[env(safe-area-inset-top)] pt-5">
          <ThemeToggleButton />
        </div> */}

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

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 text-center">
            <div className="text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg max-w-md mx-auto">
              ⚠️ {error}
            </div>
          </div>
        )}

        <div className="flex gap-1 md:gap-5 items-center justify-center flex-wrap pt-4 pb-4">
          {filteredDesafios.length > 0 ? (
            [...filteredDesafios]
              .sort(() => Math.random() - 0.5) // embaralha
              .slice(0, 3) // pega só 3
              .map((desafio) => (
                <PubliCard
                  key={desafio.id}
                  desafio={desafio}
                />
              ))
          ) : (
            <p className="text-black dark:text-white text-center p-4">
              {searchQuery ? "Nenhum desafio encontrado para sua busca" : "Nenhum desafio público disponível"}
            </p>
          )}
        </div>
      </header>
    </div>
  )
}