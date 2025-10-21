"use client";

import { GripVertical, Plus, Loader2, RefreshCw } from "lucide-react";
import * as React from "react";

import * as Kanban from "@/components/ui/kanban";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useKanbanChallenges } from "@/hooks/useKanbanChallenges";
import { ChallengeType } from "@/types/challenge";
import DetalhesDesafio from "@/components/desafio/detailsDesafio";

const COLUMN_TITLES: Record<string, string> = {
  idea_generation: "Geração de Ideias",        
  pre_screening: "Pré-triagem",               
  ideation: "Ideação",                       
  detailed_screening: "Triagem Detalhada",   
  experimentation: "Experimentação",         
};

const COLUMN_ORDER = [
  "idea_generation",
  "pre_screening",
  "ideation",
  "detailed_screening",
  "experimentation",
];

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const PRIORITY_VARIANTS = {
  high: "solid",
  medium: "light",
  low: "light",
};

const PRIORITY_COLORS = {
  high: "error",
  medium: "warning",
  low: "success",
};

export default function ChallengesKanbanPage() {
  const {
    columns,
    setColumns,
    isLoading,
    error,
    moveChallenge,
    refreshChallenges,
  } = useKanbanChallenges();

  const [selectedChallenge, setSelectedChallenge] =
    React.useState<ChallengeType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const openDetails = (challenge: ChallengeType) => {
    if (!challenge?.id) return;

    const formatIsoToPtBR = (iso?: string | null) => {
      if (!iso) return "—";
      try {
        const d = new Date(iso);
        return d.toLocaleDateString("pt-BR");
      } catch {
        return String(iso);
      }
    };

    const normalizedChallenge = {
      ...challenge,
      title: (challenge as any).name || (challenge as any).title,
      name: (challenge as any).name || (challenge as any).title,
      startDate: formatIsoToPtBR(
        (challenge as any).startDate ??
          (challenge as any).start_date ??
          (challenge as any).start
      ),
      endDate: formatIsoToPtBR(
        (challenge as any).endDate ??
          (challenge as any).end_date ??
          (challenge as any).end
      ),
    };

    setSelectedChallenge(normalizedChallenge as ChallengeType);
    setIsDetailOpen(true);
  };

  const closeDetails = () => {
    setIsDetailOpen(false);
    setSelectedChallenge(null);
  };

  const handleColumnsChange = React.useCallback(
    async (newColumns: Record<string, any[]>) => {
      for (const [newColumnId, newColumnChallenges] of Object.entries(
        newColumns
      )) {
        const oldColumnChallenges = columns[newColumnId] || [];

        for (const challenge of newColumnChallenges) {
          const wasInThisColumn = oldColumnChallenges.some(
            (c) => c.id === challenge.id
          );

          if (!wasInThisColumn) {
            setColumns(newColumns);

            try {
              await moveChallenge(challenge.id, newColumnId);
            } catch (err) {
              console.error("Erro ao atualizar:", err);
              setColumns(columns);
            }
            return;
          }
        }
      }

      setColumns(newColumns);
    },
    [columns, setColumns, moveChallenge]
  );

  const handleMove = React.useCallback(async (event: any) => {
    console.log(" onMove chamado:", event);
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
          <p className="text-muted-foreground">
            Gerencie os desafios da sua empresa
          </p>
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

      <div className="flex-1 ">
        <Kanban.Root
          value={columns}
          onValueChange={handleColumnsChange}
          onMove={handleMove}
          getItemValue={(item: any) => item.id}
        >
          <Kanban.Board className="flex overflow-auto h-full">
            {COLUMN_ORDER.map((columnValue) => (
              <ChallengeColumn
                key={columnValue}
                value={columnValue}
                challenges={columns[columnValue] ?? []}
                onOpenDetail={openDetails}
              />
            ))}
          </Kanban.Board>

          <Kanban.Overlay>
            {({ value, variant }) => {
              if (variant === "column") {
                const challenges = columns[value] ?? [];
                return (
                  <ChallengeColumn
                    value={value}
                    challenges={challenges}
                    onOpenDetail={openDetails}
                  />
                );
              }

              const challenge = Object.values(columns)
                .flat()
                .find((c: any) => c.id === value);
              if (!challenge) return null;

              return (
                <ChallengeCard
                  challenge={challenge}
                  onClick={() => openDetails(challenge)}
                />
              );
            }}
          </Kanban.Overlay>
        </Kanban.Root>
      </div>

      {isDetailOpen && selectedChallenge && (
        <DetalhesDesafio
          challenge={selectedChallenge as any}
          isOpen={isDetailOpen}
          onClose={closeDetails}
          isAdmin={false}
        />
      )}
    </div>
  );
}

interface ChallengeCardProps
  extends Omit<React.ComponentProps<typeof Kanban.Item>, "value"> {
  challenge: Partial<ChallengeType> & {
    id: string;
    title?: string;
    description?: string;
    priority?: string;
    assignee?: string;
    dueDate?: string;
  };
}

function ChallengeCard({ challenge, ...props }: ChallengeCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não definida";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Data inválida";
    }
  };

  const { onClick, ...itemProps } = props as any;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  const challengeData = (challenge as any).todosOsDados || challenge;

  const title = challengeData.name || challengeData.title || "Sem título";
  const description = challengeData.description || challengeData.theme || "";
  const priority = challengeData.priority || "low";
  const assignee =
    challengeData.assignee || challengeData.responsible || challengeData.userId;
  const dueDate = challengeData.endDate || challengeData.dueDate;

  return (
    <Kanban.Item key={challenge.id} value={challenge.id} {...itemProps}>
      <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-md hover:shadow-lg transition-all p-4 cursor-pointer">
        <div className="flex gap-3">
          <Kanban.ItemHandle asChild>
            <button
              className="cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-1 flex-shrink-0 self-start h-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </button>
          </Kanban.ItemHandle>

          <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(e);
              }
            }}
            className="flex-1 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start gap-2">
              <p className="font-semibold text-sm line-clamp-2 flex-1">
                {title}
              </p>
            </div>

            {description && (
              <p className="text-xs text-gray-600 line-clamp-3">
                {description}
              </p>
            )}

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              {assignee ? (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-200 flex-shrink-0" />
                  <span className="line-clamp-1 text-[10px]">
                    ID: {assignee.substring(0, 8)}...
                  </span>
                </div>
              ) : (
                <div />
              )}
              {dueDate && (
                <time className="text-[10px] tabular-nums flex-shrink-0">
                  {formatDate(dueDate)}
                </time>
              )}
            </div>
          </div>
        </div>
      </div>
    </Kanban.Item>
  );
}

interface ChallengeColumnProps
  extends Omit<React.ComponentProps<typeof Kanban.Column>, "children"> {
  challenges: any[];
  onOpenDetail?: (c: Partial<ChallengeType>) => void;
}

function ChallengeColumn({
  value,
  challenges,
  onOpenDetail,
  ...props
}: ChallengeColumnProps) {
  return (
    <Kanban.Column value={value} {...props}>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{COLUMN_TITLES[value]}</span>
          <Badge>{challenges.length}</Badge>
        </div>
        <Kanban.ColumnHandle asChild>
          <Button variant="outline" size="sm" className="cursor-grab">
            <GripVertical className="h-4 w-4" />
          </Button>
        </Kanban.ColumnHandle>
      </div>

      <div className="flex flex-col gap-2 p-2">
        {challenges.map((challenge: any) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onClick={() => onOpenDetail?.(challenge)}
          />
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
