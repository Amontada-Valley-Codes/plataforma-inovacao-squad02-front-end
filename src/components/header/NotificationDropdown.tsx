"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, Check, X } from "lucide-react";

import api from "@/services/axiosServices";
import { toast } from "sonner";

interface ConnectionRequest {
  id: string;
  startupName: string;
  challengeTitle: string;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carrega o companyId do localStorage apenas no cliente
  useEffect(() => {
    const id = localStorage.getItem("companyId");
    setCompanyId(id);
  }, []);

  const loadRequests = async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/connections/${companyId}/pending`);
      setRequests(data || []);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
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
      console.error("Erro ao atualizar solicitação:", error);
      toast.error("Erro ao processar ação.");
    }
  };


  useEffect(() => {
    if (companyId) {
      loadRequests();
    }
  }, [companyId]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5" />
        {requests.length > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-2 z-50">
          {loading ? (
            <p className="text-sm text-gray-500 text-center p-2">
              Carregando solicitações...
            </p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center p-2">
              Nenhuma solicitação pendente
            </p>
          ) : (
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{req.startupName}</p>
                    <p className="text-xs text-gray-500">quer participar do desafio</p>
                    <p className="text-xs font-medium">{req.challengeTitle}</p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleAction(req.id, "accept")}
                      className="p-1 rounded-full hover:bg-green-100"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="p-1 rounded-full hover:bg-red-100"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}