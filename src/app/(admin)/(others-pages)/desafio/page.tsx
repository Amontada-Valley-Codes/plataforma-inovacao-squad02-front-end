"use client";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getUserRole } from "@/utils/getUserRole";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import { Lightbulb, Search, Filter, X } from "lucide-react";
import Card from "@/components/desafio/card";
import api from "@/services/axiosServices";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import Swal from "sweetalert2";

const formSchema = z
  .object({
    name: z.string().min(2, "Digite pelo menos 2 letras"),
    startDate: z.date("Selecione a data de início"),
    endDate: z.date("Selecione a data final"),
    theme: z.string().min(3, "Digite mais detalhes para o tema"),
    description: z.string().min(3, "Digite uma descrição mais completa"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "A data final deve ser depois da data de início",
    path: ["endDate"],
  });

type FormData = z.infer<typeof formSchema>;

type Desafio = {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  theme: string;
  description: string;
  funnelStage: string;
  visibility: "PUBLIC" | "INTERNAL";
};

const funnelStages = [
  { label: "Todos", value: "ALL" },
  { label: "Geração de Ideia", value: "IDEA_GENERATION" },
  { label: "Pré-Triagem", value: "PRE_SCREENING" },
  { label: "Ideação", value: "IDEATION" },
  { label: "Triagem Detalhada", value: "DETAILED_SCREENING" },
  { label: "Experimentação", value: "EXPERIMENTATION" },
];

const statusList = [
  { label: "Todos", value: "ALL" },
  { label: "Ativo", value: "ACTIVE" },
  { label: "Inativo", value: "INACTIVE" },
  { label: "Expirado", value: "EXPIRED" },
  { label: "Pendente", value: "PENDING" },
];

export default function Page() {
  const { isOpen, openModal, closeModal } = useModal();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleState, setRoleState] = useState<string | null>(null);
  const [editingDesafio, setEditingDesafio] = useState<Desafio | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [funnelStageFilter, setFunnelStageFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const userRole = getUserRole();
    setRoleState(userRole);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        setDebouncedSearch(searchTerm);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      theme: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const {
    control: editControl,
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  const onSubmit = async (data: FormData) => {
    setError(null);
    const payload = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };

    try {
      const response = await api.post("/internal/challenges", payload);
      Swal.fire({
        title: "Sucesso!",
        text: "Desafio cadastrado com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      });
      console.log("Desafio cadastrado:", response.data);
      setDesafios((prev) => [...prev, response.data]);
      reset();
      closeModal();
    } catch (error) {
      console.error("Erro ao cadastrar", error);
      setError("Erro ao criar desafio. Tente novamente.");
    }
  };

  const onEdit = async (data: FormData) => {
    if (!editingDesafio) return;
    setError(null);
    const payload = {
      ...data,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };

    try {
      const response = await api.put(
        `/internal/challenges/${editingDesafio.id}`,
        payload
      );
      Swal.fire({
        title: "Sucesso!",
        text: "Desafio atualizado com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      });
      console.log("Desafio atualizado:", response.data);
      setDesafios((prev) =>
        prev.map((desafio) =>
          desafio.id === editingDesafio.id ? response.data : desafio
        )
      );
      setEditModalOpen(false);
      setEditingDesafio(null);
      editReset();
      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar", error);
      setError("Erro ao atualizar desafio. Tente novamente.");
    }
  };

  const onDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      customClass: {
        container: "z-[9999] ",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.delete(`/internal/challenges/${id}`);
      setDesafios((prev) => prev.filter((desafio) => desafio.id !== id));
    } catch (error) {
      console.error("Erro ao excluir", error);
      setError("Erro ao excluir desafio. Tente novamente.");
    } finally {
      Swal.fire({
        title: "Excluído!",
        text: "O desafio foi excluído.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      });
      closeModal();
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setVisibilityFilter("ALL");
    setStatusFilter("ALL");
    setFunnelStageFilter("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || visibilityFilter !== "ALL" || statusFilter !== "ALL" || funnelStageFilter !== "ALL";

  const openEditModal = (desafio: Desafio) => {
    setEditingDesafio(desafio);
    editReset({
      name: desafio.name,
      theme: desafio.theme,
      description: desafio.description,
      startDate: new Date(desafio.startDate),
      endDate: new Date(desafio.endDate),
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingDesafio(null);
  };

  useEffect(() => {
    const fetchDesafios = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        let desafiosResult = [];

        // 1) SE TEM BUSCA ATIVA
        if (debouncedSearch && debouncedSearch.trim() !== "") {
          console.log("🔍 Buscando por:", debouncedSearch);
          
          try {
            response = await api.get("/internal/challenges/search", {
              params: { query: debouncedSearch, page: currentPage, limit: 15 },
            });
            console.log("📦 Resposta completa da API:", response.data);
            desafiosResult = response.data.challenges;
            console.log("✅ Busca API retornou:", desafiosResult.length, "resultados");
          } catch (searchError) {
            console.log("⚠️ Endpoint de busca falhou, fazendo busca local");
            
            response = await api.get("/internal/challenges", {
              params: { 
                page: 1, 
                limit: 1000
              },
            });
            
            const allDesafios = response?.data?.challenges ?? response?.data?.data ?? response?.data ?? [];
            console.log("📦 Total de desafios para filtrar:", allDesafios.length);
            
            const searchLower = debouncedSearch.toLowerCase();
            desafiosResult = Array.isArray(allDesafios) ? allDesafios.filter((d) => {
              const matchName = d.name?.toLowerCase().includes(searchLower);
              const matchTheme = d.theme?.toLowerCase().includes(searchLower);
              const matchDesc = d.description?.toLowerCase().includes(searchLower);
              return matchName || matchTheme || matchDesc;
            }) : [];
            
            console.log("✅ Busca local retornou:", desafiosResult.length, "resultados");
          }
          
          setDesafios(desafiosResult);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        
        // 2) SE TEM FILTROS ATIVOS (status ou funnel)
        if (statusFilter !== "ALL" || funnelStageFilter !== "ALL") {
          console.log("🎯 Aplicando filtros:", { statusFilter, funnelStageFilter });
          
          const params: any = {};
          if (statusFilter !== "ALL") params.status = statusFilter;
          if (funnelStageFilter !== "ALL") params.funnelStage = funnelStageFilter;
          if (visibilityFilter !== "ALL") params.visibility = visibilityFilter;
          params.page = currentPage;
          params.limit = 15;

          try {
            response = await api.get("/internal/challenges/filter", { params });
            desafiosResult = response?.data?.challenges ?? response?.data?.data ?? response?.data ?? [];
            console.log("✅ Filtro API retornou:", desafiosResult.length, "resultados");
          } catch (filterError) {
            console.log("⚠️ Endpoint de filtro falhou, fazendo filtro local");
            
            response = await api.get("/internal/challenges", {
              params: { 
                visibility: visibilityFilter !== "ALL" ? visibilityFilter : undefined,
                page: 1, 
                limit: 1000 
              },
            });
            
            const allDesafios = response?.data?.challenges ?? response?.data?.data ?? response?.data ?? [];
            desafiosResult = Array.isArray(allDesafios) ? allDesafios.filter((d) => {
              const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
              const matchFunnel = funnelStageFilter === "ALL" || d.funnelStage === funnelStageFilter;
              return matchStatus && matchFunnel;
            }) : [];
            
            console.log("✅ Filtro local retornou:", desafiosResult.length, "resultados");
          }
          
          setDesafios(desafiosResult);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        
        // 3) BUSCA PADRÃO (sem filtros nem busca)
        console.log("📋 Buscando todos os desafios");
        response = await api.get("/internal/challenges", {
          params: {
            visibility: visibilityFilter !== "ALL" ? visibilityFilter : undefined,
            page: currentPage,
            limit: 15,
          },
        });

        desafiosResult = response?.data?.challenges ?? response?.data?.data ?? response?.data ?? [];
        console.log("✅ Listagem retornou:", desafiosResult.length, "resultados");
        
        setDesafios(desafiosResult);

        if (response?.data?.pagination) {
          setTotalPages(Math.max(1, Math.ceil(response.data.pagination.total / response.data.pagination.limit)));
        } else {
          setTotalPages(1);
        }
        
      } catch (err) {
        console.error("❌ Erro ao buscar desafios:", err);
        setError("Erro ao carregar desafios.");
        setDesafios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesafios();
  }, [currentPage, visibilityFilter, statusFilter, funnelStageFilter, debouncedSearch]);  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-3 py-5 rounded-2xl">
        <div className="flex justify-between items-center">
          <p className="text-2xl">Desafios</p>
          <Button onClick={openModal} size="sm" variant="primary">
            <Lightbulb size={20} />
            Criar Desafio
          </Button>
        </div>
      </div>

      <div className="px-6 pb-8">
        {error ? (
          <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        ) : !loading && desafios.length === 0 && !hasActiveFilters ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-dashed border-orange-200">
            <Lightbulb className="w-16 h-16 mx-auto text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Nenhum desafio criado ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-300">
              Comece criando seu primeiro desafio!
            </p>
          </div>
        ) : (
          <>
          {/* 🔍 Barra de busca e filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            {/* Busca + Botão Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Buscar por nome, tema ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={18} />
                Filtros
                {hasActiveFilters && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {[searchTerm, visibilityFilter !== "ALL", statusFilter !== "ALL", funnelStageFilter !== "ALL"].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Filtros Expandíveis */}
            {showFilters && (
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Visibilidade */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Visibilidade</Label>
                    <select
                      value={visibilityFilter}
                      onChange={(e) => { setVisibilityFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ALL">Todos</option>
                      <option value="PUBLIC">Público</option>
                      <option value="INTERNAL">Interno</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Status</Label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      {statusList.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Etapa */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Etapa do Funil</Label>
                    <select
                      value={funnelStageFilter}
                      onChange={(e) => { setFunnelStageFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      {funnelStages.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Limpar Filtros */}
                {hasActiveFilters && (
                  <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={clearFilters} className="flex items-center gap-2">
                      <X size={16} />
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {!loading && desafios.length === 0 && hasActiveFilters && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Nenhum desafio encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Não encontramos desafios com os filtros aplicados
              </p>
              <Button size="sm" variant="outline" onClick={clearFilters} className="flex items-center gap-2 mx-auto">
                <X size={16} />
                Limpar todos os filtros
              </Button>
            </div>
          )}

          {desafios.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(desafios) && desafios.map((desafio) => (
                  <Card
                    key={desafio.id}
                    id={desafio.id}
                    title={desafio.name}
                    description={desafio.description}
                    status={desafio.status}
                    startDate={new Date(desafio.startDate).toLocaleDateString()}
                    endDate={
                      desafio.endDate
                        ? new Date(desafio.endDate).toLocaleDateString()
                        : ""
                    }
                    theme={desafio.theme}
                    visibility={desafio.visibility}
                    funnelStage={desafio.funnelStage}
                    isAdmin={roleState === "MANAGER"}
                    onEdit={() => openEditModal(desafio)}
                    onDelete={() => onDelete(desafio.id)}
                    onVisibilityChange={(newVisibility) => {
                      setDesafios((prev) =>
                        prev.map((d) =>
                          d.id === desafio.id
                            ? { ...d, visibility: newVisibility }
                            : d
                        )
                      );
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
          </>
        )}
      </div>

      {/* Modal de Criar Desafio */}
      <div>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <ComponentCard title="Criar um novo desafio">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && <div className="text-red-600">{error}</div>}
              <div className="px-6 space-y-5">
                <div>
                  <Label>Nome:</Label>
                  <Input
                    placeholder="Digite o nome do desafio"
                    type="text"
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="text-red-600">{errors.name.message}</span>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <DatePicker
                        id="date-picker"
                        label="Data de início"
                        placeholder="Selecione uma data"
                        defaultDate={field.value}
                        onChange={(dates) => field.onChange(dates[0])}
                      />
                    )}
                  />
                  {errors.startDate && (
                    <span className="text-red-600">
                      {errors.startDate.message}
                    </span>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <DatePicker
                        id="date-final"
                        label="Data final"
                        placeholder="Selecione uma data"
                        defaultDate={field.value}
                        onChange={(dates) => field.onChange(dates[0])}
                      />
                    )}
                  />
                  {errors.endDate && (
                    <span className="text-red-600">
                      {errors.endDate.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label>Tema:</Label>
                  <Input
                    placeholder="Digite o tema"
                    type="text"
                    {...register("theme")}
                  />
                  {errors.theme && (
                    <span className="text-red-600">{errors.theme.message}</span>
                  )}
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <TextArea
                        className="text-gray-950"
                        rows={6}
                        placeholder="Digite uma descrição"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.description && (
                    <span className="text-red-600">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                <Button className="w-full mt-2" size="sm">
                  Criar Desafio
                </Button>
              </div>
            </form>
          </ComponentCard>
        </Modal>
      </div>

      {/* Modal de Editar Desafio */}
      <div>
        <Modal isOpen={editModalOpen} onClose={closeEditModal}>
          <ComponentCard title="Editar desafio">
            <form onSubmit={handleEditSubmit(onEdit)}>
              {error && <div className="text-red-600">{error}</div>}
              <div className="px-6 space-y-5">
                <div>
                  <Label>Nome:</Label>
                  <Input
                    placeholder="Digite o nome do desafio"
                    type="text"
                    {...editRegister("name")}
                  />
                  {editErrors.name && (
                    <span className="text-red-600">
                      {editErrors.name.message}
                    </span>
                  )}
                </div>

                <div>
                  <Controller
                    control={editControl}
                    name="startDate"
                    render={({ field }) => (
                      <DatePicker
                        id="edit-date-picker"
                        label="Data de início"
                        placeholder="Selecione uma data"
                        defaultDate={field.value}
                        onChange={(dates) => field.onChange(dates[0])}
                      />
                    )}
                  />
                  {editErrors.startDate && (
                    <span className="text-red-600">
                      {editErrors.startDate.message}
                    </span>
                  )}
                </div>

                <div>
                  <Controller
                    control={editControl}
                    name="endDate"
                    render={({ field }) => (
                      <DatePicker
                        id="edit-date-final"
                        label="Data final"
                        placeholder="Selecione uma data"
                        defaultDate={field.value}
                        onChange={(dates) => field.onChange(dates[0])}
                      />
                    )}
                  />
                  {editErrors.endDate && (
                    <span className="text-red-600">
                      {editErrors.endDate.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label>Tema:</Label>
                  <Input
                    placeholder="Digite o tema"
                    type="text"
                    {...editRegister("theme")}
                  />
                  {editErrors.theme && (
                    <span className="text-red-600">
                      {editErrors.theme.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Controller
                    control={editControl}
                    name="description"
                    render={({ field }) => (
                      <TextArea
                        className="text-gray-950"
                        rows={6}
                        placeholder="Digite uma descrição"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {editErrors.description && (
                    <span className="text-red-600">
                      {editErrors.description.message}
                    </span>
                  )}
                </div>

                <Button className="w-full mt-2" size="sm">
                  Atualizar Desafio
                </Button>
              </div>
            </form>
          </ComponentCard>
        </Modal>
      </div>
    </div>
  );
}