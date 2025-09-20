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

const formSchema = z.object({
  nome:z.string().min(2, 'digite mais'),
  dateInicial:z.date(),
  dateFinal:z.date(),
  tema:z.string().min(3, 'digite mais'),
  descricao:z.string().min(3, 'digite mais')
  
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
    resolver: zodResolver(formSchema)
  })


  const onSubmit = (data: FormData) => {
    console.log("Form enviado:", data);
    reset()
  };

  return (
    <div>
  
      <div className="flex justify-between">
        <p className="text-2xl">Desafio</p>
        <Button onClick={openModal} size="sm" variant="primary">
              <Lightbulb size={20} />
              Criar Desafio
        </Button>
        
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
                {...register("nome")}
                />
              </div>

            <Controller
              control={control}
              name="dateInicial"
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

             <Controller
              control={control}
              name="dateFinal"
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

            <div>
              <Label >Tema:</Label>
              <Input 
              placeholder="Digite seu nome"
              type="text"
              {...register("tema")}
              />
            </div>
              
            <Label >Descriçao</Label>
            <Controller
              control={control}
              name="descricao"
              render={({ field }) => (
                <TextArea
                className="text-gray-950"
                  rows={6}
                  placeholder="Digite uma descrição"
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.descricao}
                  hint={errors.descricao?.message}
                />
              )}
            />

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
