"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, Check, X, Building2, Lightbulb } from "lucide-react";
import api from "@/services/axiosServices";
import { toast } from "sonner";
import { getUserRole } from "@/utils/getUserRole";

interface ConnectionRequest {
  id: string;
  startupName: string;
  challengeTitle: string;
  startupDescription?: string;
  createdAt?: string;
}


interface ApiConnectionRequest {
  id: string;
  startup?: {
    name: string;
    problems?: string;
  };
  startupName?: string;
  challenge?: {
    name?: string;
    title?: string;
  };
  challengeTitle?: string;
  createdAt?: string;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/connections/pending');
      
      console.log('Resposta da API:', response.data);
      
      const requestsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || response.data.connections || []);
      
     
      const mappedRequests: ConnectionRequest[] = requestsData.map((req: ApiConnectionRequest) => ({
        id: req.id,
        startupName: req.startup?.name || req.startupName || "Startup não informada",
        challengeTitle: req.challenge?.title || req.challenge?.name || req.challengeTitle || "Desafio não informado",
        startupDescription: req.startup?.problems || "",
        createdAt: req.createdAt
      }));
      
      console.log('Requests mapeadas:', mappedRequests);
      
      setRequests(mappedRequests);
    } catch (error: any) {
      console.error('Erro ao carregar notificações:', error); 
      if (error.response?.status === 404) {
        setRequests([]);
      } else if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Erro ao carregar notificações");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      await api.patch(`/connections/${id}/${action}`);
      toast.success(
        action === "accept"
          ? "Solicitação aceita com sucesso!"
          : "Solicitação recusada."
      );
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Erro ao processar ação:', error);
      toast.error("Erro ao processar ação.");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `há ${diffMins}min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;
    return date.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    if (userRole === "MANAGER") {
      loadRequests();
      
      const interval = setInterval(() => {
        loadRequests();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (userRole !== "MANAGER") {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5" />
        {requests.length > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Solicitações de Conexão
            </h3>
            <p className="text-xs text-white/80 mt-1">
              {requests.length} {requests.length === 1 ? "solicitação pendente" : "solicitações pendentes"}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nenhuma solicitação pendente
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Novas solicitações aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                          {req.startupName}
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                            Desafio:
                          </p>
                          <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 line-clamp-2">
                            {req.challengeTitle}
                          </p>
                        </div>
                      </div>

                      {req.startupDescription && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 ml-6">
                          {req.startupDescription}
                        </p>
                      )}

                      {req.createdAt && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-6">
                          {formatDate(req.createdAt)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(req.id, "accept")}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 transition group"
                        title="Aceitar solicitação"
                      >
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition" />
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "reject")}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition group"
                        title="Recusar solicitação"
                      >
                        <X className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}