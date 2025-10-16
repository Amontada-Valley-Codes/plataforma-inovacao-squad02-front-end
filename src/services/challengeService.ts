// services/challengeService.ts
import api from '../services/axiosServices';

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: string;
  funnelStage: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface CreateChallengeData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
}

export interface UpdateChallengeData extends Partial<CreateChallengeData> {
  funnelStage?: string;
}

// Mapeamento das colunas para os valores da API
export const COLUMN_TO_FUNNEL_STAGE: Record<string, string> = {
  ideacao: 'IDEATION',
  pretriagem: 'PRE_SCREENING',
  colaboracao: 'IDEA_GENERATION',
  avaliacao: 'DETAILED_SCREENING',
  experimentacao: 'EXPERIMENTATION',
};

export const FUNNEL_STAGE_TO_COLUMN: Record<string, string> = {
  IDEA_GENERATION: 'colaboracao',
  PRE_SCREENING: 'pretriagem',
  IDEATION: 'ideacao',
  DETAILED_SCREENING: 'avaliacao',
  EXPERIMENTATION: 'experimentacao',
};

// Função auxiliar para organizar desafios por etapa
function organizeChallengesByFunnelStage(challenges: Challenge[]): Record<string, Challenge[]> {
  const organized: Record<string, Challenge[]> = {
    ideacao: [],
    pretriagem: [],
    colaboracao: [],
    avaliacao: [],
    experimentacao: [],
  };

  challenges.forEach(challenge => {
    const column = FUNNEL_STAGE_TO_COLUMN[challenge.funnelStage];
    if (column && organized[column]) {
      organized[column].push(challenge);
    } else {
      // Se não encontrar a coluna, adiciona em ideação por padrão
      console.warn(`FunnelStage desconhecido: ${challenge.funnelStage}`);
      organized.ideacao.push(challenge);
    }
  });

  return organized;
}

// Serviços da API
export const challengeService = {
  // Criar um novo desafio
  async createChallenge(data: CreateChallengeData): Promise<Challenge> {
    try {
      const response = await api.post('/internal/challenges', data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao criar desafio');
    }
  },

  // Listar todos os desafios com paginação
  async getChallenges(page: number = 0, size: number = 100): Promise<Challenge[]> {
    try {
      const response = await api.get('/internal/challenges', {
        params: { page, size }
      });
      
      // Trata diferentes formatos de resposta
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
      }
      
      console.warn('Formato de resposta inesperado:', response.data);
      return [];
      
    } catch (error: any) {
      // Não loga erro aqui pois o fallback vai resolver
      // Apenas lança o erro para ativar o método alternativo
      throw error;
    }
  },

  // Obter um desafio pelo ID
  async getChallengeById(id: string): Promise<Challenge> {
    try {
      const response = await api.get(`/internal/challenges/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao buscar desafio');
    }
  },

  // Atualizar um desafio
  async updateChallenge(id: string, data: UpdateChallengeData): Promise<Challenge> {
    try {
      const response = await api.put(`/internal/challenges/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar desafio');
    }
  },

  // Deletar um desafio (apenas MANAGER)
  async deleteChallenge(id: string): Promise<void> {
    try {
      await api.delete(`/internal/challenges/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao deletar desafio');
    }
  },

  // Listar desafios por etapa do funil
  async getChallengesByFunnelStage(funnelStage: string): Promise<Challenge[]> {
    try {
      const response = await api.get('/internal/challenges/status/funnelStage', {
        params: { funnelStage }
      });
      
      // Trata diferentes formatos de resposta
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
      }
      
      console.warn(`Formato inesperado para ${funnelStage}:`, response.data);
      return [];
      
    } catch (error: any) {
      console.error(`Erro ao buscar desafios para ${funnelStage}:`, {
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Se for 403 ou 500, retorna array vazio em vez de quebrar
      if (error.response?.status === 403 || error.response?.status === 500) {
        console.warn(`Status ${error.response?.status} para ${funnelStage}. Retornando vazio.`);
        return [];
      }
      
      return [];
    }
  },

  // Atualizar etapa do funil de um desafio
  async updateChallengeFunnelStage(id: string, funnelStage: string): Promise<void> {
    try {
      console.log('📡 Atualizando etapa do desafio:', { id, funnelStage });
      
      const url = `/internal/challenges/status/${id}`;
      console.log('🔗 URL completa:', `${url}?funnelStage=${funnelStage}`);
      
      // Faz a requisição PUT SEM BODY (apenas query parameter)
      // O backend não espera body, apenas o query parameter
      const response = await api.put(`${url}?funnelStage=${funnelStage}`);
      
      console.log('✅ Resposta da API:', response.data);
      console.log('✅ Status:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ ERRO COMPLETO ao atualizar etapa:', {
        id,
        funnelStage,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      throw new Error(error.response?.data?.message || `Erro ao atualizar etapa do desafio (Status: ${error.response?.status})`);
    }
  },

  // Carregar todos os desafios organizados por etapa do funil
  async getAllChallengesOrganized(): Promise<Record<string, Challenge[]>> {
    console.log('🔍 Iniciando carregamento de desafios...');
    
    // Tenta primeiro buscar todos de uma vez (mais rápido)
    try {
      console.log('📥 Tentando buscar todos os desafios de uma vez...');
      const allChallenges = await this.getChallenges(0, 100);
      
      if (allChallenges.length > 0) {
        console.log(`✅ ${allChallenges.length} desafios carregados com sucesso!`);
        return organizeChallengesByFunnelStage(allChallenges);
      }
    } catch (error: any) {
      console.warn('⚠️ Método principal falhou. Usando método alternativo (busca por etapa)...');
    }
    
    // Fallback: busca por etapa individualmente
    const results: Record<string, Challenge[]> = {
      ideacao: [],
      pretriagem: [],
      colaboracao: [],
      avaliacao: [],
      experimentacao: [],
    };

    const funnelStages = Object.entries(COLUMN_TO_FUNNEL_STAGE);
    
    // Busca cada etapa individualmente
    const promises = funnelStages.map(async ([columnKey, funnelStage]) => {
      try {
        console.log(`🔎 Buscando ${funnelStage}...`);
        const challenges = await this.getChallengesByFunnelStage(funnelStage);
        console.log(`✅ ${challenges.length} desafios em ${funnelStage}`);
        results[columnKey] = challenges;
      } catch (err) {
        console.error(`❌ Erro ao carregar ${funnelStage}`);
        results[columnKey] = [];
      }
    });

    await Promise.allSettled(promises);
    
    const totalChallenges = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`✅ Carregamento concluído! Total: ${totalChallenges} desafios`);

    return results;
  },
};