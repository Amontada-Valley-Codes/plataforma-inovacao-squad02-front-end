"use client";

import { GripVertical, Plus, Loader2, RefreshCw } from "lucide-react";
import * as React from "react";

import * as Kanban from "@/components/ui/kanban";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useKanbanChallenges } from '@/hooks/useKanbanChallenges';
import { Challenge } from '@/services/challengeService';

const COLUMN_TITLES: Record<string, string> = {
  ideacao: "Ideação",
  pretriagem: "Pré-triagem",
  colaboracao: "Colaboração",
  avaliacao: "Avaliação",
  experimentacao: "Experimentação",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa"
};

const PRIORITY_VARIANTS: Record<string, any> = {
  high: "primary",
  medium: "outline",
  low: "secondary"
};

export default function ChallengesKanbanPage() {
  const {
    columns,
    setColumns,
    isLoading,
    error,
    moveChallenge,
    refreshChallenges
  } = useKanbanChallenges();

  // Handler para quando as colunas mudam (drag and drop)
  const handleColumnsChange = React.useCallback(async (newColumns: Record<string, Challenge[]>) => {
    console.log('');
    console.log('🎯 ===== MUDANÇA DE COLUNAS DETECTADA =====');
    
    // Compara o estado antigo com o novo para descobrir o que mudou
    const oldChallenges = Object.values(columns).flat();
    const newChallenges = Object.values(newColumns).flat();
    
    console.log('📊 Desafios antes:', oldChallenges.map(c => ({ id: c.id.slice(0,8), stage: c.funnelStage })));
    console.log('📊 Desafios depois:', newChallenges.map(c => ({ id: c.id.slice(0,8), stage: c.funnelStage })));
    
    // Encontra qual desafio mudou de coluna
    for (const [newColumnId, newColumnChallenges] of Object.entries(newColumns)) {
      const oldColumnChallenges = columns[newColumnId] || [];
      
      // Verifica se há novos desafios nesta coluna
      for (const challenge of newColumnChallenges) {
        const wasInThisColumn = oldColumnChallenges.some(c => c.id === challenge.id);
        
        if (!wasInThisColumn) {
          // Este desafio foi movido PARA esta coluna
          console.log('✅ Desafio movido:', {
            id: challenge.id,
            title: challenge.title,
            para: newColumnId
          });
          
          // Atualiza a UI primeiro
          setColumns(newColumns);
          
          try {
            // Depois atualiza no backend
            console.log('🚀 Atualizando no backend...');
            await moveChallenge(challenge.id, newColumnId);
            console.log('✅ Atualização concluída!');
          } catch (error) {
            console.error('❌ Erro ao atualizar:', error);
            // Se falhar, reverte
            setColumns(columns);
          }
          
          console.log('🎯 ===== FIM DA MUDANÇA =====');
          console.log('');
          return; // Para após encontrar o primeiro movimento
        }
      }
    }
    
    // Se não encontrou mudança, apenas atualiza
    setColumns(newColumns);
  }, [columns, setColumns, moveChallenge]);

  // Handler para quando um item é movido (pode não ser chamado por todos os componentes Kanban)
  const handleMove = React.useCallback(async (event: any) => {
    console.log('⚠️ onMove foi chamado (isso é raro neste componente)');
    console.log('Evento:', event);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando desafios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={refreshChallenges}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Desafios Internos</h1>
          <p className="text-muted-foreground">Gerencie os desafios da sua empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshChallenges}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Desafio
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <Kanban.Root
          value={columns}
          onValueChange={handleColumnsChange}
          onMove={handleMove}
          getItemValue={(item: Challenge) => item.id}
        >
          <Kanban.Board className="flex overflow-auto h-full">
            {Object.entries(columns).map(([columnValue, challenges]) => (
              <ChallengeColumn 
                key={columnValue} 
                value={columnValue} 
                challenges={challenges} 
              />
            ))}
          </Kanban.Board>
          <Kanban.Overlay>
            {({ value, variant }) => {
              if (variant === "column") {
                const challenges = columns[value] ?? [];
                return <ChallengeColumn value={value} challenges={challenges} />;
              }

              const challenge = Object.values(columns)
                .flat()
                .find((challenge) => challenge.id === value);

              if (!challenge) return null;

              return <ChallengeCard challenge={challenge} />;
            }}
          </Kanban.Overlay>
        </Kanban.Root>
      </div>
    </div>
  );
}

interface ChallengeCardProps
  extends Omit<React.ComponentProps<typeof Kanban.Item>, "value"> {
  challenge: Challenge;
}

function ChallengeCard({ challenge, ...props }: ChallengeCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Kanban.Item key={challenge.id} value={challenge.id} asChild {...props}>
      <div className="rounded-md border bg-card p-3 shadow-xs hover:shadow-sm transition-shadow cursor-grab active:cursor-grabbing">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 font-medium text-sm">
              {challenge.title}
            </span>
            <Badge variant={PRIORITY_VARIANTS[challenge.priority]}>
              {PRIORITY_LABELS[challenge.priority]}
            </Badge>
          </div>
          
          {challenge.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {challenge.description}
            </p>
          )}

          <div className="flex items-center justify-between text-muted-foreground text-xs">
            {challenge.assignee && (
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-primary/20" />
                <span className="line-clamp-1">{challenge.assignee}</span>
              </div>
            )}
            {challenge.dueDate && (
              <time className="text-[10px] tabular-nums">
                {formatDate(challenge.dueDate)}
              </time>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>ID: {challenge.id.slice(0, 8)}...</span>
            <span>Stage: {challenge.funnelStage}</span>
          </div>
        </div>
      </div>
    </Kanban.Item>
  );
}

interface ChallengeColumnProps
  extends Omit<React.ComponentProps<typeof Kanban.Column>, "children"> {
  challenges: Challenge[];
}

function ChallengeColumn({ value, challenges, ...props }: ChallengeColumnProps) {
  return (
    <Kanban.Column value={value} {...props}>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{COLUMN_TITLES[value]}</span>
          <Badge >
            {challenges.length}
          </Badge>
        </div>
        <Kanban.ColumnHandle asChild>
          <Button variant="outline" size="sm" className="cursor-grab">
            <GripVertical className="h-4 w-4" />
          </Button>
        </Kanban.ColumnHandle>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} asHandle />
        ))}
        {challenges.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed rounded-md">
            Nenhum desafio
          </div>
        )}
      </div>
    </Kanban.Column>
  );
}