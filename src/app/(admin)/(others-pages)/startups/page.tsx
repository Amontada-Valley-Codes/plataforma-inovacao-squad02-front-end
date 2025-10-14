'use client'

import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

const segments = [
  "FINTECH", "HEALTH", "EDUCATION", "AGRITECH", "INDUSTRY", "ENERGY",
  "RETAIL", "MARKETING", "LEGAL", "HR", "REAL_ESTATE", "TRANSPORT",
  "ENVIRONMENT", "CYBERSECURITY", "AI", "OTHER",
];


const formSchema = z.object({
    name:z.string().min(3, "Digite o nome da Startup"),
    cnpj:z.string().max(14, "cnpj invalido"),   
    segment:z.array(z.string().min(1, "Selecione pelo menos um segmento")),
    technologies:z.array(z.string().min(1, "selecione pelo menos uma tecnologia")),
    problems:z.string().min(2, 'digite um problema maior'),
    location:z.string().min(2, "digite uma localizaçao correta"),
    founders:z.array(z.string().min(1, "selecione pelo menos um fundador")),
    pitch:z.string().min(2, "digite uma pitch correta"),
    links:z.array(z.string().min(1, "selecione pelo menos um link")),
})


type FormData = z.infer<typeof formSchema>


export default function Page(){

    const { isOpen, openModal, closeModal } = useModal();

      const {
           
            register,
            handleSubmit,
            // reset,
            watch,
            setValue,
            formState:{errors}
        }=useForm<FormData>({
            resolver:zodResolver(formSchema),
            defaultValues: {
                segment: [],      
                technologies: [],   
            },
            })

        const onSubmit = (data:FormData)=>{

            console.log(data)
        }







         const selectedSegments = watch("segment");


         const handleCheckboxChange = (
            field: "segment" | "technologies",
            value: string
        ) => {
            const current = watch(field);
            const updated = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
            setValue(field, updated);
        };


    return(
        <div>
            <div className="flex justify-between">
              

            <p className="text-2xl">Cadastro da Startups</p>
            <Button onClick={openModal} size="sm" variant="primary">Nova Empresa</Button>
                
            </div>


             <Modal  isOpen={isOpen} onClose={closeModal}>
                <ComponentCard title="Criar nova empresa">
                     <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}> 
                        <div>
                            <Label>Nome Startup</Label>
                            <Input
                            type="text"
                            placeholder="Nome Startup"
                            {...register('name')}
                            />
                            {errors.name && (
                                <span className="text-red-600">{errors.name.message}</span>
                            )}
                        </div>

                        <div>
                            <Label>Cnpj</Label>
                            <Input
                            type="text"
                            placeholder="XX.XXX.XXX/0001-XX"
                            {...register('cnpj')}
                            />
                            {errors.cnpj && (
                                <span className="text-red-600">{errors.cnpj.message}</span>
                            )}
                        </div>

                        

                        <div>
                            <Label>Segmentos</Label>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                            {segments.map((s) => (
                            <label key={s} className="flex items-center gap-2">
                                <input
                                type="checkbox"
                                value={s}
                                checked={selectedSegments.includes(s)}
                                onChange={() => handleCheckboxChange("segment", s)}
                               
                                />
                                <span>{s}</span>
                            </label>
                            ))}
                            </div>
                        </div>

                        <div>
                            <Button>enviar</Button>
                        </div>


                     </form>
                    
                </ComponentCard>


                
             </Modal>
            
        </div>
    )
}