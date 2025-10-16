"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/services/axiosServices";
import { useEffect, useState } from "react";
import StartupCard from "@/components/startup/StartupCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SEGMENTS = ["EDUCATION", "HEALTH", "AI", "FINTECH", "MOBILE"] as const;
const TECHNOLOGIES = ["AI", "MOBILE", "WEB", "IOT", "BLOCKCHAIN"] as const;
const STAGES = ["IDEATION", "MVP", "GROWTH", "SCALE"] as const;

const formSchema = z.object({
  name: z.string().min(3, "Digite o nome da Startup"),
  cnpj: z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
  segment: z.array(z.enum(SEGMENTS)).nonempty("Escolha pelo menos um segmento"),
  technologies: z.array(z.enum(TECHNOLOGIES)).nonempty("Escolha pelo menos uma tecnologia"),
  stage: z.enum(STAGES),
  problems: z.string().min(5, "Descreva melhor o problema"),
  location: z.string().min(2, "Digite uma localização válida"),
  founders: z.array(z.string().min(1, "Informe pelo menos um fundador")),
  pitch: z.string().min(5, "Descreva melhor o pitch"),
  links: z.array(z.string().url("Link inválido").min(5, "Informe pelo menos um link válido")),
});

type FormData = z.infer<typeof formSchema>;

type StartupResponse = {
  data: FormData[];
  total: number;
  page: number;
  limit: number;
};

export default function Page() {
  const { isOpen, openModal, closeModal } = useModal();
  const [startups, setStartups] = useState<FormData[]>([]);
  const [expandedStartup, setExpandedStartup] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segment: [],
      technologies: [],
      founders: [""],
      links: [""],
    },
  });

  const selectedSegments = watch("segment", []);
  const selectedTechnologies = watch("technologies", []);

  type SegmentValue = typeof SEGMENTS[number];
  type TechnologyValue = typeof TECHNOLOGIES[number];

  const handleCheckboxChange = (
    field: "segment" | "technologies",
    value: SegmentValue | TechnologyValue
  ) => {
    const current = watch(field);
    const updated = current.includes(value as any)
      ? current.filter((v) => v !== value)
      : [...current, value as any];
    setValue(field, updated as any, { shouldValidate: true });
  };

  const handleToggleExpand = (index: number) => {
    setExpandedStartup(expandedStartup === index ? null : index);
  };

  // Função para buscar startups do backend com paginação
  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await api.get<StartupResponse>("/startup", {
        params: {
          page: currentPage,
          limit: 9, // Mesmo limite dos desafios
        },
      });
      setStartups(res.data.data);
      setTotalPages(Math.ceil(res.data.total / res.data.limit));
    } catch (error) {
      console.error("Erro ao buscar startups:", error);
      setError("Erro ao carregar startups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [currentPage]);

  // Envio do formulário
  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/startup", data);
      console.log("Startup cadastrada:", response.data);
      closeModal();
      reset();
      fetchStartups(); // Atualiza a lista automaticamente
      // Volta para a primeira página para ver o novo item
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao cadastrar startup:", error);
      setError("Erro ao cadastrar startup.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-semibold">Cadastro da Startup</p>
        <Button onClick={openModal} size="sm" variant="primary">
          Nova Empresa
        </Button>
      </div>

      {/* Lista de startups com paginação */}
      <div className="px-6 pb-8">
        {error ? (
          <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        ) : !loading && startups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border-2 border-dashed border-orange-200">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma startup cadastrada ainda
            </h3>
            <p className="text-gray-500">Comece criando sua primeira startup!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup, index) => (
                <StartupCard
                  key={index}
                  name={startup.name}
                  cnpj={startup.cnpj}
                  segment={startup.segment}
                  technologies={startup.technologies}
                  stage={startup.stage}
                  problems={startup.problems}
                  location={startup.location}
                  founders={startup.founders}
                  pitch={startup.pitch}
                  links={startup.links}
                  createdAt={new Date().toLocaleDateString("pt-BR")}
                  isExpanded={expandedStartup === index}
                  onToggleExpand={() => handleToggleExpand(index)}
                />
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>

      {/* Modal de cadastro */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ComponentCard title="Criar nova empresa">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Nome */}
            <div>
              <Label>Nome da Startup</Label>
              <Input type="text" placeholder="Nome da Startup" {...register("name")} />
              {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
            </div>

            {/* CNPJ */}
            <div>
              <Label>CNPJ</Label>
              <Input type="text" placeholder="XX.XXX.XXX/0001-XX" {...register("cnpj")} />
              {errors.cnpj && <span className="text-red-600 text-sm">{errors.cnpj.message}</span>}
            </div>

            {/* Segmentos */}
            <div>
              <Label>Segmentos</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {SEGMENTS.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={s}
                      checked={selectedSegments.includes(s)}
                      onChange={() => handleCheckboxChange("segment", s)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>
              {errors.segment && <p className="text-red-600 text-sm mt-1">{errors.segment.message}</p>}
            </div>

            {/* Tecnologias */}
            <div>
              <Label>Tecnologias</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {TECHNOLOGIES.map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={t}
                      checked={selectedTechnologies.includes(t)}
                      onChange={() => handleCheckboxChange("technologies", t)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
              {errors.technologies && (
                <p className="text-red-600 text-sm mt-1">{errors.technologies.message}</p>
              )}
            </div>

            {/* Estágio */}
            <div>
              <Label>Estágio</Label>
              <select
                {...register("stage")}
                className="border rounded-lg w-full p-2 outline-none mt-1"
              >
                <option value="">Selecione o estágio</option>
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              {errors.stage && <p className="text-red-600 text-sm mt-1">{errors.stage.message}</p>}
            </div>

            {/* Problemas */}
            <div>
              <Label>Problema</Label>
              <Input type="text" placeholder="Descreva o problema" {...register("problems")} />
              {errors.problems && (
                <span className="text-red-600 text-sm">{errors.problems.message}</span>
              )}
            </div>

            {/* Localização */}
            <div>
              <Label>Localização</Label>
              <Input type="text" placeholder="Ex: São Paulo - SP" {...register("location")} />
              {errors.location && (
                <span className="text-red-600 text-sm">{errors.location.message}</span>
              )}
            </div>

            {/* Fundadores */}
            <div>
              <Label>Fundadores</Label>
              <Input type="text" placeholder="Nome do fundador" {...register("founders.0")} />
              {errors.founders?.[0] && (
                <span className="text-red-600 text-sm">{errors.founders[0].message}</span>
              )}
            </div>

            {/* Pitch */}
            <div>
              <Label>Pitch</Label>
              <Input type="text" placeholder="Resumo do pitch" {...register("pitch")} />
              {errors.pitch && <span className="text-red-600 text-sm">{errors.pitch.message}</span>}
            </div>

            {/* Links */}
            <div>
              <Label>Links</Label>
              <Input
                type="url"
                placeholder="https://seusite.com"
                {...register("links.0")}
              />
              {errors.links?.[0] && <span className="text-red-600 text-sm">{errors.links[0].message}</span>}
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={closeModal}>Cancelar</Button>
              <Button>Enviar</Button>
            </div>
          </form>
        </ComponentCard>
      </Modal>
    </div>
  );
}