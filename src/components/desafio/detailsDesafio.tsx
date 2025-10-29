import { useContext, useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Ideias from "./ideias";
import {
  Calendar,
  Eye,
  Globe,
  Lock,
  Tag,
  Pencil,
  Trash2,
  Funnel,
} from "lucide-react";
import api from "@/services/axiosServices";
import { IdeiaType } from "@/types/ideia";
import { ThemeContext } from "@/context/ThemeContext";
import { ChallengeType } from "@/types/challenge";
import Button from "@/components/ui/button/Button";
import { getUserRole } from "@/utils/getUserRole";
import Swal from "sweetalert2";

type Props = {
  challenge: ChallengeType;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onVisibilityChange?: (newVisibility: "PUBLIC" | "INTERNAL") => void;
};

export default function DetalhesDesafio({
  challenge,
  isOpen,
  onClose,
  isAdmin = false,
  onEdit,
  onDelete,
  onVisibilityChange,
}: Props) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }
  const { theme: currentTheme } = themeContext;
  const [ideias, setIdeias] = useState<IdeiaType[]>([]);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  const statusTraduzido: Record<string, string> = {
    active: "Ativo",
    inactive: "Inativo",
    pending: "Pendente",
    expired: "Expirado",
    completed: "Concluído",
    canceled: "Cancelado",
  };

  const funnelStageTraduzido: Record<string, string> = {
    idea_generation: "Geração de Ideias",
    pre_screening: "Pré-Triagem",
    ideation: "Ideação",
    detailed_screening: "Triagem Detalhada",
    experimentation: "Experimentação",
  };

  useEffect(() => {
    if (isOpen && challenge.id) {
      api
        .get(`/ideas/challenge/${challenge.id}`)
        .then((res) => setIdeias(res.data))
        .catch(() => setIdeias([]));
    }
  }, [isOpen, challenge?.id]);

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase?.() ?? "";
    if (statusLower.includes("ativo") || statusLower.includes("active")) {
      return currentTheme === "dark"
        ? "bg-gradient-to-r from-green-700 to-emerald-800"
        : "bg-gradient-to-r from-green-500 to-emerald-600";
    }
    if (statusLower.includes("pendente") || statusLower.includes("pending")) {
      return currentTheme === "dark"
        ? "bg-gradient-to-r from-yellow-700 to-amber-800"
        : "bg-gradient-to-r from-yellow-500 to-amber-600";
    }
    if (
      statusLower.includes("concluído") ||
      statusLower.includes("completed")
    ) {
      return currentTheme === "dark"
        ? "bg-gradient-to-r from-blue-700 to-indigo-800"
        : "bg-gradient-to-r from-blue-500 to-indigo-600";
    }
    return currentTheme === "dark"
      ? "bg-gradient-to-r from-orange-700 to-amber-800"
      : "bg-gradient-to-r from-orange-500 to-amber-600";
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  // Verifica se está no último estágio do funil
  const isLastStage = challenge.funnelStage.toUpperCase() === "EXPERIMENTATION";

  const handleToggleVisibility = async () => {
    const newVisibility = challenge.visibility === "PUBLIC" ? "INTERNAL" : "PUBLIC";
    
    const result = await Swal.fire({
      title: "Alterar Visibilidade",
      text: `Deseja tornar este desafio ${newVisibility === "PUBLIC" ? "público" : "privado"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#fb6514",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, alterar",
      cancelButtonText: "Cancelar",
      customClass: {
        container: "z-[9999]"
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    setUpdatingVisibility(true);
    try {
      const response = await api.patch(
        `/internal/challenges/${challenge.id}/visibility`,
        { visibility: newVisibility }
      );
      
      Swal.fire({
        title: "Sucesso!",
        text: `Visibilidade alterada para ${newVisibility === "PUBLIC" ? "público" : "privado"}.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]"
        }
      });

      if (onVisibilityChange) {
        onVisibilityChange(newVisibility);
      }
    } catch (error) {
      console.error("Erro ao atualizar visibilidade", error);
      Swal.fire({
        title: "Erro!",
        text: "Não foi possível alterar a visibilidade. Tente novamente.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]"
        }
      });
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handleRequestConnection = async () => {
    const result = await Swal.fire({
      title: "Solicitar Conexão",
      text: "Deseja manifestar interesse neste desafio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, solicitar",
      cancelButtonText: "Cancelar",
      customClass: {
        container: "z-[9999]"
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
     await api.post(`/connections/request/${challenge.id}`);
      
      Swal.fire({
        title: "Solicitação Enviada!",
        text: "Sua solicitação de conexão foi enviada com sucesso. Aguarde o retorno da empresa.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]"
        }
      });
    } catch (error: any) {
      console.error("Erro ao solicitar conexão", error);
      
      const errorMessage = error.response?.status === 400
        ? "Você já solicitou conexão com este desafio."
        : error.response?.status === 404
        ? "Desafio não encontrado."
        : "Não foi possível enviar a solicitação. Tente novamente.";
      
      Swal.fire({
        title: "Erro!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]"
        }
      });
    }
  };

  if (!isOpen || !challenge) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={`bg-gradient-to-br ${
          currentTheme === "dark"
            ? "from-gray-800 to-gray-900"
            : "from-white to-gray-50"
        } rounded-t-2xl`}
      >
        {/* Header com gradiente e botões de admin */}
        <div
          className={`bg-gradient-to-r ${
            currentTheme === "dark"
              ? "from-gray-700 to-gray-800"
              : "from-orange-500 to-amber-600"
          } px-6 py-5 rounded-t-2xl flex justify-between items-center`}
        >
          <h2
            className={`text-2xl font-bold truncate ${
              currentTheme === "dark" ? "text-gray-200" : "text-white"
            }`}
          >
            {challenge.title}
          </h2>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                onClick={onEdit}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Pencil size={16} />
                Editar
              </Button>
              <Button
                onClick={handleDelete}
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-300/30"
              >
                <Trash2 size={16} />
                Excluir
              </Button>
            </div>
          )}

          {role === "STARTUP" && (
            <Button
              onClick={handleRequestConnection}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              ✉️ Solicitar Conexão
            </Button>
          )}
        </div>

        {/* Conteúdo */}
        <div
          className={`p-6 space-y-4 ${
            currentTheme === "dark" ? "bg-gray-800 text-gray-300" : ""
          }`}
        >
          {/* Status */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 ${
                currentTheme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-orange-50 border-orange-100"
              } px-3 py-2 rounded-lg border`}
            >
              <Eye
                className={`w-4 h-4 ${
                  currentTheme === "dark" ? "text-gray-400" : "text-orange-600"
                }`}
              />
              <span
                className={`font-semibold ${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status:
              </span>
            </div>
            <span
              className={`${getStatusColor(
                challenge.status
              )} px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm`}
            >
              {statusTraduzido[challenge.status.toLowerCase()] ||
                challenge.status}
            </span>
          </div>

          {/* Tema */}
          <div
            className={`bg-gradient-to-r ${
              currentTheme === "dark"
                ? "from-gray-700 to-gray-800 border-gray-600"
                : "from-orange-50 to-amber-50 border-orange-100"
            } p-4 rounded-xl border-2`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Tag
                className={`w-5 h-5 ${
                  currentTheme === "dark" ? "text-gray-400" : "text-orange-600"
                }`}
              />
              <span
                className={`font-semibold ${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Tema:
              </span>
            </div>
            <p
              className={`${
                currentTheme === "dark" ? "text-gray-400" : "text-orange-700"
              } font-medium ml-7`}
            >
              {challenge.theme}
            </p>
          </div>

          {/* Descrição */}
          <div
            className={`p-4 rounded-xl border-2 shadow-sm ${
              currentTheme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-300"
                : "bg-white border-orange-100 text-gray-600"
            }`}
          >
            <span
              className={`font-semibold block mb-2 ${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Descrição:
            </span>
            <p className="leading-relaxed">{challenge.description}</p>
          </div>

          {/* Data */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
              currentTheme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100"
            }`}
          >
            <Calendar
              className={`w-5 h-5 flex-shrink-0 ${
                currentTheme === "dark" ? "text-gray-400" : "text-orange-600"
              }`}
            />
            <div>
              <span
                className={`font-semibold block text-sm mb-1 ${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Período:
              </span>
              <span
                className={`${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-medium`}
              >
                {challenge.startDate} → {challenge.endDate}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
              currentTheme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100"
            }`}
          >
            <Funnel
              className={`w-5 h-5 flex-shrink-0 ${
                currentTheme === "dark" ? "text-gray-400" : "text-orange-600"
              }`}
            />
            <div>
              <span
                className={`font-semibold block text-sm mb-1 ${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Estágio no funil de inovação:
              </span>
              <span
                className={`${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                } font-medium`}
              >
                {funnelStageTraduzido[challenge.funnelStage.toLowerCase()] ||
                  challenge.funnelStage}
              </span>
            </div>
          </div>

          {/* Visibilidade com botão para alterar (apenas no último estágio e para admin) */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 ${
                currentTheme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-orange-50 border-orange-100"
              } px-3 py-2 rounded-lg border`}
            >
              <span
                className={`font-semibold ${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Visibilidade:
              </span>
            </div>
            {challenge.visibility === "PUBLIC" ? (
              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm ${
                  currentTheme === "dark"
                    ? "bg-gradient-to-r from-green-700 to-emerald-800"
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
                }`}
              >
                <Globe className="w-4 h-4" />
                Público
              </span>
            ) : (
              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm ${
                  currentTheme === "dark"
                    ? "bg-gradient-to-r from-slate-800 to-slate-900"
                    : "bg-gradient-to-r from-slate-600 to-slate-700"
                }`}
              >
                <Lock className="w-4 h-4" />
                Interno
              </span>
            )}
            
            {/* Botão para alterar visibilidade (apenas no último estágio e para admin) */}
            {isAdmin && isLastStage && (
              <Button
                onClick={handleToggleVisibility}
                disabled={updatingVisibility}
                size="sm"
                className={`${
                  challenge.visibility === "PUBLIC"
                    ? "bg-slate-600 hover:bg-slate-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {updatingVisibility ? (
                  "Alterando..."
                ) : challenge.visibility === "PUBLIC" ? (
                  <>
                    <Lock size={16} />
                    Tornar Privado
                  </>
                ) : (
                  <>
                    <Globe size={16} />
                    Tornar Público
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Ideias */}
      <div
        className={`border-t-2 ${
          challenge.funnelStage === "IDEATION" ||
          challenge.funnelStage === "DETAILED_SCREENING" ||
          challenge.funnelStage === "EXPERIMENTATION"
            ? "block"
            : "hidden"
        } ${
          currentTheme === "dark"
            ? "border-gray-600 bg-gray-800"
            : "border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50"
        }`}
      >
        <Ideias
          ideias={ideias}
          challengeId={challenge.id}
          funnelStage={challenge.funnelStage}
        />
      </div>
    </Modal>
  );
}