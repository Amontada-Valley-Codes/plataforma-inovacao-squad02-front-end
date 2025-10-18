"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/services/axiosServices";
import { useEffect, useState, useCallback } from "react";
import StartupCard from "@/components/startup/StartupCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const formSchema = z.object({
  name: z.string().min(3, "Digite o nome da Startup"),
  cnpj: z.string().min(18, "CNPJ inválido"),
  segment: z.array(z.enum(["HEALTH","EDUCATION","AGRITECH","INDUSTRY","ENERGY","MARKETING", "TRANSPORT","ENVIRONMENT","CYBERSECURITY","AI",])).min(1, "Selecione pelo menos um Seguimento"),
  technologies: z.array(z.enum(["AI", "MOBILE", "WEB3", "BLOCKCHAIN", "IOT"])).min(1, "Selecione pelo menos uma tecnologia"),
  stage: z.enum(["IDEATION", "OPERATION", "TRACTION", "SCALE"]),
  problems: z.string().min(5, "Descreva melhor o problema"),
  location: z.string().min(2, "Digite uma localização válida"),
  founders: z.array(z.string().min(1, "Nome do fundador é obrigatório")),
  pitch: z.string().min(5, "Descreva melhor o pitch"),
  links: z.array(z.string().min(1, "Link é obrigatório")),
});

type FormData = z.infer<typeof formSchema>;

type StartupResponse = {
  data: Startup[];
  total: number;
  page: number;
  limit: number;
};

type Startup = FormData & {
  id: string;
  createdAt: string;
};

const TECHNOLOGIES = [
  { value: "AI", label: "Inteligência Artificial" },
  { value: "MOBILE", label: "Aplicativos Mobile" },
  { value: "WEB3", label: "Desenvolvimento Web" },
  { value: "BLOCKCHAIN", label: "Blockchain" },
  { value: "IOT", label: "Internet das Coisas" },
];

const SEGMENTS = [
  { value: "HEALTH", label: "Saúde" },
  { value: "EDUCATION", label: "Educação" },
  { value: "AGRITECH", label: "Agrotecnologia" },
  { value: "INDUSTRY", label: "Indústria" },
  { value: "ENERGY", label: "Energia" },
  { value: "MARKETING", label: "Marketing" },
  { value: "TRANSPORT", label: "Transporte" },
  { value: "ENVIRONMENT", label: "Meio Ambiente" },
  { value: "CYBERSECURITY", label: "Cibersegurança" },
  { value: "AI", label: "Inteligência Artificial" },
];

export default function Page() {
  const { isOpen, openModal, closeModal } = useModal();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      founders: [""],
      links: [""],
    },
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray<any>({
    control,
    name: "links",
  });

  const {
    fields: founderFields,
    append: appendFounder,
    remove: removeFounder,
  } = useFieldArray<any>({
    control,
    name: "founders",
  });

  const fetchStartups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<StartupResponse>("/startup", {
        params: {
          page: currentPage,
          limit: 9,
        },
      });
      setStartups(res.data.data);
      setTotalPages(Math.ceil(res.data.total / res.data.limit));
    } catch (err) {
      console.error("Erro ao buscar startups:", err);
      setError("Erro ao carregar startups. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    console.log(data);
    try {
      await api.post("/startup", data);
      closeModal();
      reset({
        founders: [""],
        links: [""],
      });
      setCurrentPage(1);
      await fetchStartups();
    } catch (err) {
      console.error("Erro ao cadastrar startup:", err);
      setError("Erro ao cadastrar startup. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Cadastro da Startup</h1>
        <Button onClick={openModal} size="sm" variant="primary">
          Criar Startup
        </Button>
      </div>

      <div className="px-6 pb-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border-2 border-dashed border-orange-200">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma startup cadastrada ainda
            </h3>
            <p className="text-gray-500">
              Comece criando sua primeira startup!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <StartupCard
                  key={startup.id}
                  id={startup.id}
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
                  createdAt={new Date(startup.createdAt).toLocaleDateString(
                    "pt-BR"
                  )}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === idx + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(idx + 1);
                          }}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ComponentCard title="Criar nova empresa">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="name">Nome da Startup</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nome da Startup"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                placeholder="XX.XXX.XXX/0001-XX"
                {...register("cnpj")}
              />
              {errors.cnpj && (
                <span className="text-red-600 text-sm">
                  {errors.cnpj.message}
                </span>
              )}
            </div>

            <div>
              <Label>Tecnologias</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {TECHNOLOGIES.map((tech) => (
                  <label
                    key={tech.value}
                    className="flex items-center space-x-2 border rounded-md px-3 py-1 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={tech.value}
                      {...register("technologies")}
                      className="accent-blue-600"
                    />
                    <span>{tech.label}</span>
                  </label>
                ))}
              </div>
              {errors.technologies && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.technologies.message}
                </p>
              )}
            </div>

            <div>
              <Label>Seguimentos</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {SEGMENTS.map((seg) => (
                  <label
                    key={seg.value}
                    className="flex items-center space-x-2 border rounded-md px-3 py-1 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={seg.value}
                      {...register("segment")}
                      className="accent-blue-600"
                    />
                    <span>{seg.label}</span>
                  </label>
                ))}
              </div>
              {errors.segment && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.segment.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="stage">Estágio</Label>
              <select
                id="stage"
                {...register("stage")}
                className="border rounded-lg w-full p-2 outline-none mt-1"
              >
                <option value="">Selecione o Estágio</option>
                <option value="IDEATION">Ideação</option>
                <option value="OPERATION">Operação</option>
                <option value="TRACTION">Tração</option>
                <option value="SCALE">Escala</option>
              </select>
              {errors.stage && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.stage.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="problems">Problema</Label>
              <Input
                id="problems"
                type="text"
                placeholder="Descreva o problema"
                {...register("problems")}
              />
              {errors.problems && (
                <span className="text-red-600 text-sm">
                  {errors.problems.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                type="text"
                placeholder="Ex: São Paulo - SP"
                {...register("location")}
              />
              {errors.location && (
                <span className="text-red-600 text-sm">
                  {errors.location.message}
                </span>
              )}
            </div>

            <div>
              <Label>Fundadores</Label>
              {founderFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Nome do fundador"
                    {...register(`founders.${index}`)}
                    className="flex-1"
                  />
                  {founderFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFounder(index)}
                      className="text-red-500 font-bold px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {errors.founders && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.founders.message || errors.founders[0]?.message}
                </span>
              )}
              <button
                type="button"
                onClick={() => appendFounder("")}
                className="mt-2 text-blue-600 text-sm underline"
              >
                + Adicionar fundador
              </button>
            </div>

            <div>
              <Label htmlFor="pitch">Pitch</Label>
              <Input
                id="pitch"
                type="text"
                placeholder="Resumo do pitch"
                {...register("pitch")}
              />
              {errors.pitch && (
                <span className="text-red-600 text-sm">
                  {errors.pitch.message}
                </span>
              )}
            </div>

            <div>
              <Label>Links</Label>
              {linkFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mt-2">
                  <Input
                    type="url"
                    placeholder="https://exemplo.com"
                    {...register(`links.${index}`)}
                    className="flex-1"
                  />
                  {linkFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 font-bold px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {errors.links && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.links.message || errors.links[0]?.message}
                </span>
              )}
              <button
                type="button"
                onClick={() => appendLink("")}
                className="mt-2 text-blue-600 text-sm underline"
              >
                + Adicionar link
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={closeModal} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </Modal>
    </div>
  );
}
