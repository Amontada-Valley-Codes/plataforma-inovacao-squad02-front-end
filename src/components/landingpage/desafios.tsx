'use client'
import { useState, useEffect } from "react";
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

export default function Desafios() {
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

        // 🔹 PROCESSAR A RESPOSTA (igual na página que funciona)
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
      nome: "Otimização de Processos Logísticos",
      tema: "Logística Inteligente",
      descricao: "Desenvolver sistema inteligente para rastreamento em tempo real de cargas e previsão de demandas na cadeia logística.",
      privacidade: "PUBLICO",
      dataInicio: "2024-02-01T00:00:00.000Z",
      dataFim: "2024-08-31T23:59:59.000Z",
      status: "ATIVO",
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z"
    },
    {
      id: "2",
      nome: "Soluções para Agricultura Sustentável",
      tema: "AgroTech Verde",
      descricao: "Criar plataforma de monitoramento de solo e clima para otimizar uso de recursos hídricos e reduzir impacto ambiental.",
      privacidade: "PUBLICO",
      dataInicio: "2024-03-15T00:00:00.000Z",
      dataFim: "2024-09-30T23:59:59.000Z",
      status: "ATIVO",
      createdAt: "2024-02-20T14:30:00.000Z",
      updatedAt: "2024-02-20T14:30:00.000Z"
    },
    {
      id: "3", 
      nome: "Plataforma de Educação Inclusiva",
      tema: "EdTech Acessível",
      descricao: "Desenvolver aplicativo educacional com recursos de acessibilidade para pessoas com deficiência visual e auditiva.",
      privacidade: "PUBLICO",
      dataInicio: "2024-01-10T00:00:00.000Z",
      dataFim: "2024-07-15T23:59:59.000Z",
      status: "ATIVO",
      createdAt: "2024-01-05T09:15:00.000Z", 
      updatedAt: "2024-01-05T09:15:00.000Z"
    }
  ];

  // Embaralhar e pegar 3 aleatórios
  const desafiosAleatorios = [...desafios]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="w-full h-auto flex flex-col items-center justify-center px-4">
        <h2 className="font-semibold text-2xl md:text-4xl pt-23">Desafios <span className="text-warning-500">Lançados</span></h2>
        <div className="text-gray-600 dark:text-gray-400 text-center mt-3 md:mb-15 mb-6 text-base md:text-xl">
          Carregando desafios públicos...
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-80 h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center px-4 pt-23">
      <h2 className="font-semibold text-2xl md:text-4xl">Desafios <span className="text-warning-500">Lançados</span></h2>
      <div className="text-gray-600 dark:text-gray-400 text-center mt-3 md:mb-15 mb-6 text-base md:text-xl">
        Veja desafios lançados publicamente por startups
      </div>

      {error && (
        <div className="mb-6 text-center">
          <div className="text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg max-w-md">
            ⚠️ {error}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-6xl">
        {desafiosAleatorios.map((desafio) => (
          <PubliCard key={desafio.id} desafio={desafio} />
        ))}
      </div>

      <div className="my-8 border-b-2 w-full border-warning-500 py-6 flex justify-center">
        <button className="bg-warning-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-warning-400 text-white py-2 px-4 rounded-md">
          <a href="/desafios-publicos">Ver Mais Desafios</a>
        </button>
      </div>
    </div>
  );
}