"use client";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import { Lightbulb } from "lucide-react";
import Card from "@/components/desafio/card";
import api from "@/services/axiosServices";
import { queryObjects } from "v8";

const formSchema = z
  .object({
    name: z.string().min(2, "Digite pelo menos 2 letras"),
    startDate: z.date("Selecione a data de início"),
    endDate: z.date("Selecione a data final"),
    theme: z.string().min(3, "Digite mais detalhes para o tema"),
    description: z.string().min(3, "Digite uma descrição mais completa"),
    visibility: z.enum(["PUBLIC", "INTERNAL"], "selecione Uma Opção"),
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
  visibility: "PUBLIC" | "INTERNAL";
};

export default function page() {
  const { isOpen, openModal, closeModal } = useModal();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.log("Desafio cadastrado:", response.data);
      setDesafios((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao cadastrar", error);
      setError("Erro ao criar desafio. Tente novamente.");
    }
    reset();
    closeModal();
  };

  useEffect(() => {
    const fetchDesafios = async () => {
      setLoading(true);
      try {
        const response = await api.get("/public/challenges", {
          params: {
            page: 1,
            limit: 10,
          },
        });
        const desafios = response.data.data; 
        const total = response.data.total;
        setDesafios(desafios);
      } catch (error) {
        console.error("Erro ao buscar desafios", error);
        setError("Erro ao carregar desafios.");
      } finally {
        setLoading(false);
      }
    };
    fetchDesafios();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-3 py-5  rounded-2xl">
        <div className="flex justify-between items-center">
          <p className="text-2xl">Desafio</p>
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
        ) : !loading && desafios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border-2 border-dashed border-orange-200">
            <Lightbulb className="w-16 h-16 mx-auto text-orange-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum desafio criado ainda
            </h3>
            <p className="text-gray-500">Comece criando seu primeiro desafio!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {desafios.map((desafio) => (
              <Card
                key={desafio.id}
                id={desafio.id}
                title={desafio.name}
                description={desafio.description}
                stats={desafio.status}
                startDate={new Date(desafio.startDate).toLocaleDateString()}
                endDate={
                  desafio.endDate
                    ? new Date(desafio.endDate).toLocaleDateString()
                    : ""
                }
                theme={desafio.theme}
                visibility={desafio.visibility}
              />
            ))}
          </div>
        )}
      </div>

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
                    <span className="text-red-600">{errors.startDate.message}</span>
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
                    <span className="text-red-600">{errors.endDate.message}</span>
                  )}
                </div>

                <div>
                  <Label>Tema:</Label>
                  <Input
                    placeholder="Digite seu nome"
                    type="text"
                    {...register("theme")}
                  />
                  {errors.theme && (
                    <span className="text-red-600">{errors.theme.message}</span>
                  )}
                </div>

                <div>
                  <Label>Descriçao</Label>
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

                <div>
                  <Label>selecione</Label>
                  <select
                    className="px-5 py-2 w-full border rounded  "
                    {...register("visibility")}
                  >
                    <option value="">selecione um</option>
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="INTERNAL">INTERNAL</option>
                  </select>
                  {errors.visibility && (
                    <span className="text-red-600">{errors.visibility.message}</span>
                  )}
                </div>

                <Button className="w-full mt-2" size="sm">
                  enviar
                </Button>
              </div>
            </form>
          </ComponentCard>
        </Modal>
      </div>
    </div>
  );
}
