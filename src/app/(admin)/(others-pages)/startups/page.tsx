'use client'

import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@/components/ui/button/Button";


const formSchema = z.object({
    name:z.string().min(3, "Digite o nome da Startup"),
    cnpj:z.string().max(14, "cnpj invalido"),
    // segment:string
  
})


type FormData = z.infer<typeof formSchema>


export default function page(){

    const { isOpen, openModal, closeModal } = useModal();

      const {
           
            register,
            handleSubmit,
            reset,
            formState:{errors}
        }=useForm<FormData>({
            resolver:zodResolver(formSchema)
        })

        const onSubmit = (data:FormData)=>{

            console.log(data)
        }


    return(
        <div>
            <div className="flex justify-between">
              

            <p className="text-2xl">Cadastro da Startups</p>
            <Button onClick={openModal} size="sm" variant="primary">Nova Empresa</Button>
                
            </div>


             <Modal  isOpen={isOpen} onClose={closeModal}>
                <ComponentCard title="Criar nova empresa">
                     <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}> 


                     </form>
                    
                </ComponentCard>


                
             </Modal>
            
        </div>
    )
}