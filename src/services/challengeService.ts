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


export const COLUMN_TO_FUNNEL_STAGE = {
  idea_generation: "IDEA_GENERATION",
  pre_screening: "PRE_SCREENING",
  ideation: "IDEATION",
  detailed_screening: "DETAILED_SCREENING",
  experimentation: "EXPERIMENTATION",
};

export const FUNNEL_STAGE_TO_COLUMN: Record<string, string> = {
  IDEA_GENERATION: "idea_generation",
  PRE_SCREENING: "pre_screening",
  IDEATION: "ideation",
  DETAILED_SCREENING: "detailed_screening",
  EXPERIMENTATION: "experimentation",
};


function organizeChallengesByFunnelStage(challenges: Challenge[]): Record<string, Challenge[]> {
  const organized: Record<string, Challenge[]> = {
    idea_generation: [],
    pre_screening: [],
    ideation: [],
    detailed_screening: [],
    experimentation: [],
  };

  challenges.forEach(challenge => {
    const column = FUNNEL_STAGE_TO_COLUMN[challenge.funnelStage];
    if (column && organized[column]) {
      organized[column].push(challenge);
    } else {
      console.warn(`FunnelStage desconhecido: ${challenge.funnelStage}`);
      organized.idea_generation.push(challenge);
    }
  });

  return organized;
}

export const challengeService = {

  async createChallenge(data: CreateChallengeData): Promise<Challenge> {
    try {
      const response = await api.post('/internal/challenges', data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao criar desafio');
    }
  },


  async getChallenges(page: number = 1, size: number = 10): Promise<Challenge[]> {
    try {
      const response = await api.get('/internal/challenges', {
        params: { page, limit: size }
      });
      return response.data.challenges || [];
    } catch (error: any) {
      console.error('Erro ao buscar desafios:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao buscar desafios');
    }
  },


  async getChallengeById(id: string): Promise<Challenge> {
    try {
      const response = await api.get(`/internal/challenges/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao buscar desafio');
    }
  },


  async updateChallenge(id: string, data: UpdateChallengeData): Promise<Challenge> {
    try {
      const response = await api.put(`/internal/challenges/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar desafio');
    }
  },


  async deleteChallenge(id: string): Promise<void> {
    try {
      await api.delete(`/internal/challenges/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar desafio:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao deletar desafio');
    }
  },


  async getChallengesByFunnelStage(funnelStage: string): Promise<Challenge[]> {
    try {
      const response = await api.get('/internal/challenges/filter', {
        params: { funnelStage }
      });
      return Array.isArray(response.data) ? response.data : response.data.challenges || [];
    } catch (error: any) {
      console.error(`Erro ao buscar desafios para ${funnelStage}:`, {
        status: error.response?.status,
        data: error.response?.data
      });
      return [];
    }
  },

 
  async updateChallengeFunnelStage(id: string, funnelStage: string): Promise<void> {
  try {
    await api.put(`/internal/challenges/${id}/status`, {}, {  
      params: { funnelStage },
      headers: { 'Content-Type': 'application/json' },      
    });
  } catch (error: any) {
    console.error('❌ Erro ao atualizar etapa do desafio:', {
      id,
      funnelStage,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    throw new Error(error.response?.data?.message || 'Erro ao atualizar etapa do desafio');
  }
},

  // Buscar todos os desafios organizados por etapa
  async getAllChallengesOrganized(): Promise<Record<string, Challenge[]>> {
    try {
      const allChallenges = await this.getChallenges(1, 100);
      return organizeChallengesByFunnelStage(allChallenges);
    } catch (error: any) {
      console.warn('Falha ao buscar todos os desafios de uma vez, tentando por etapa...');
      const results: Record<string, Challenge[]> = {
        idea_generation: [],
        pre_screening: [],
        ideation: [],
        detailed_screening: [],
        experimentation: [],
      };

      const funnelStages = Object.entries(COLUMN_TO_FUNNEL_STAGE);

      await Promise.allSettled(
        funnelStages.map(async ([columnKey, funnelStage]) => {
          const challenges = await this.getChallengesByFunnelStage(funnelStage);
          results[columnKey] = challenges;
        })
      );

      return results;
    }
  },
};
