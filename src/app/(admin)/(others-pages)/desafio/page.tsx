'use client'
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import React from "react";
import { useForm, Controller } from "react-hook-form";


import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import { Lightbulb } from "lucide-react";
import Card from "@/components/desafio/card";
import api from "@/services/axiosServices";

const formSchema = z.object({
  name:z.string().min(2, "Digite pelo menos 2 letras"),
  startDate:z.date("Selecione a data de início"),
  endDate:z.date("Selecione a data final"),
  theme:z.string().min(3, "Digite mais detalhes para o tema"),
  description: z.string().min(3, "Digite uma descrição mais completa"),
  visibility:z.enum(['Public','Privado'], "selecione Uma Opção")
})

type FormData = z.infer<typeof formSchema>



export default function page() {

  const { isOpen, openModal, closeModal } = useModal();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState:{errors}
  }=useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    name: "",
    theme: "",
    description: "",  
    startDate: undefined,
    endDate: undefined,
  }
})


  const onSubmit = async (data: FormData) => {

    try{
      const response = await api.post('/challenges',data)
      console.log("Desafio cadastrado:", response.data);
    }catch(error){
      console.error('Erro ao cadastrar', error)
    }
    reset()
  };

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

      <div>
        <Card 
        title="Automaçâo de Processos internos"
        description="Buscando inovaçoes para automatizar processo manuais"
        stats={"ativo"}
        dateInicial={"13/06/2034"} 
        datefinal={"12/21/2121"} 
        tipo={"publico"}/>
      </div>

    
    <div>

      <Modal  isOpen={isOpen} onClose={closeModal}>
       
       <ComponentCard title="Criar um novo desafio"> 
        <form onSubmit={handleSubmit(onSubmit)} >
           <div className="px-6 space-y-5">
              <div>
                <Label >Nome:</Label>
                <Input 
                placeholder="Digite seu nome"
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
              <Label >Tema:</Label>
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
            <Label >Descriçao</Label>
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
                <span className="text-red-600">{errors.description.message}</span>
              )}
             </div>
            
            <div>

            <Label>selecione</Label>
             <select className="px-5 py-2 w-full border rounded  "
            {...register("visibility")}
             >
              <option value="">selecione um</option>
              <option value="Public">Publico</option>
              <option value="Privado">privado</option>
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
