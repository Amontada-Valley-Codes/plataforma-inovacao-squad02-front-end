// hooks/useKanbanChallenges.ts
import { useState, useEffect, useCallback } from 'react';
import { challengeService, Challenge, COLUMN_TO_FUNNEL_STAGE } from '@/services/challengeService';

export function useKanbanChallenges() {
  const [columns, setColumns] = useState<Record<string, Challenge[]>>({
    ideacao: [],
    pretriagem: [],
    colaboracao: [],
    avaliacao: [],
    experimentacao: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar desafios
  const loadChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const organizedChallenges = await challengeService.getAllChallengesOrganized();
      setColumns(organizedChallenges);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar desafios';
      setError(errorMessage);
      console.error('Erro ao carregar desafios:', err);
      
      // Se for erro de permissão, mostra mensagem específica
      if (errorMessage.includes('permissão')) {
        setError('Você não tem permissão para acessar os desafios. Entre em contato com o administrador.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mover desafio entre colunas
  const moveChallenge = useCallback(async (challengeId: string, newColumn: string) => {
    console.log('');
    console.log('🎯 ===== INICIANDO MOVIMENTAÇÃO =====');
    console.log('🔄 Movendo desafio:', { challengeId, newColumn });
    
    const funnelStage = COLUMN_TO_FUNNEL_STAGE[newColumn];
    
    if (!funnelStage) {
      console.error('❌ Coluna inválida:', newColumn);
      console.error('❌ Colunas disponíveis:', Object.keys(COLUMN_TO_FUNNEL_STAGE));
      return;
    }

    console.log('📍 FunnelStage correspondente:', funnelStage);

    // Salva o estado anterior para rollback
    const previousColumns = { ...columns };

    try {
      // Atualização otimista (UI primeiro)
      setColumns(prevColumns => {
        const newColumns = { ...prevColumns };
        let movedChallenge: Challenge | undefined;
        let oldColumn: string | undefined;

        // Remove o desafio da coluna antiga
        Object.keys(newColumns).forEach(column => {
          const index = newColumns[column].findIndex(c => c.id === challengeId);
          if (index > -1) {
            movedChallenge = { ...newColumns[column][index], funnelStage };
            newColumns[column] = newColumns[column].filter(c => c.id !== challengeId);
            oldColumn = column;
            console.log(`🗑️ Removido da coluna: ${column}`);
          }
        });

        // Adiciona à nova coluna
        if (movedChallenge) {
          newColumns[newColumn] = [...newColumns[newColumn], movedChallenge];
          console.log(`✅ Adicionado à coluna: ${newColumn}`);
          console.log('📦 Desafio movido:', {
            id: movedChallenge.id,
            title: movedChallenge.title,
            de: oldColumn,
            para: newColumn,
            funnelStage: funnelStage
          });
        } else {
          console.error('❌ Desafio não encontrado nas colunas:', challengeId);
          console.error('❌ Desafios disponíveis:', Object.entries(prevColumns).map(([col, challenges]) => ({
            coluna: col,
            ids: challenges.map(c => c.id)
          })));
        }

        return newColumns;
      });

      // Atualiza no backend
      console.log('📡 Enviando atualização para API...');
      console.log('📡 Parâmetros:', { challengeId, funnelStage });
      
      await challengeService.updateChallengeFunnelStage(challengeId, funnelStage);
      
      console.log('✅ Atualização bem-sucedida no backend!');
      console.log('🎯 ===== MOVIMENTAÇÃO CONCLUÍDA =====');
      console.log('');
      
    } catch (err: any) {
      console.error('');
      console.error('💥 ===== ERRO NA MOVIMENTAÇÃO =====');
      console.error('❌ Erro ao mover desafio:', err);
      console.error('❌ Detalhes:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      
      // Reverte para o estado anterior
      setColumns(previousColumns);
      console.log('⏪ Estado revertido para posição original');
      console.log('💥 ===== FIM DO ERRO =====');
      console.log('');
      
      // Mostra erro ao usuário
      const errorMessage = err.message || 'Erro ao mover desafio';
      setError(errorMessage);
      
      // Limpa o erro após 5 segundos
      setTimeout(() => setError(null), 5000);
    }
  }, [columns]);

  // Atualizar um desafio
  const updateChallenge = useCallback(async (challengeId: string, data: Partial<Challenge>) => {
    try {
      await challengeService.updateChallenge(challengeId, data);
      await loadChallenges();
    } catch (err: any) {
      console.error('Erro ao atualizar desafio:', err);
      setError(err.message || 'Erro ao atualizar desafio');
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  }, [loadChallenges]);

  // Criar novo desafio
  const createChallenge = useCallback(async (data: any) => {
    try {
      const newChallenge = await challengeService.createChallenge(data);
      
      // Adiciona otimisticamente à coluna de ideação
      setColumns(prev => ({
        ...prev,
        ideacao: [...prev.ideacao, newChallenge]
      }));
      
      return newChallenge;
    } catch (err: any) {
      console.error('Erro ao criar desafio:', err);
      setError(err.message || 'Erro ao criar desafio');
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  }, []);

  // Deletar desafio
  const deleteChallenge = useCallback(async (challengeId: string) => {
    const previousColumns = { ...columns };
    
    try {
      // Remove otimisticamente
      setColumns(prev => {
        const newColumns = { ...prev };
        Object.keys(newColumns).forEach(column => {
          newColumns[column] = newColumns[column].filter(c => c.id !== challengeId);
        });
        return newColumns;
      });
      
      await challengeService.deleteChallenge(challengeId);
    } catch (err: any) {
      console.error('Erro ao deletar desafio:', err);
      // Reverte
      setColumns(previousColumns);
      setError(err.message || 'Erro ao deletar desafio');
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  }, [columns]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  return {
    columns,
    setColumns,
    isLoading,
    error,
    moveChallenge,
    updateChallenge,
    createChallenge,
    deleteChallenge,
    refreshChallenges: loadChallenges,
  };
}