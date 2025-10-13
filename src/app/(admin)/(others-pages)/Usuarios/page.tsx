'use client'
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import api from "@/services/axiosServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod"


const formSchema = z.object({
  email:z.string().min(5, "Email Muito Curto"),
  role:z.enum(['COMMON','EVALUATOR','MANAGER',], "selecione Uma Opção")
})

type FormData = z.infer<typeof formSchema>



export default function Page(){

    const { isOpen, openModal, closeModal } = useModal();

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors}
      }=useForm<FormData>({
        resolver: zodResolver(formSchema),
      
    })

    const onSubmit = async (data: FormData) => {

        try{
        const response = await api.post('/auth/invite', data)
        console.log(response.data);
        toast.success("Convite enviado com sucesso!!");
        
        }catch(error){
         console.error('Erro ao mandar convite', error)
         toast.error("Erro ao enviar o convite!!");
        }
        reset()
        closeModal()

    };
    
    return(
        <div>
            <div className="flex justify-between items-center">
                <p className="text-2xl">
                    Usuários da Empresa
                </p>
                <Button onClick={openModal} size="sm" variant="primary">
                    Convidar novo usuario
                </Button>
                
            </div>



             <Modal  isOpen={isOpen} onClose={closeModal}>
                 <ComponentCard title="Convidar um novo Usuario">
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="space-y-5">
                            <div>
                                <Label>Digite o email:</Label>
                                <Input
                                    placeholder="info@gmail.com"
                                    type="text"
                                    {...register('email')}

                                />
                                {errors.email && (
                                    <span className="text-red-600">{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <select className="px-5 py-2 w-full border rounded  "
                                {...register('role')}
                                >
                                    <option value="">selecione um</option>
                                    <option value="COMMON">COMMON</option>
                                    <option value="EVALUATOR">EVALUATOR</option>
                                    <option value="MANAGER">MANAGER</option>
                                  
                                </select>
                                {errors.role && (
                                    <span className="text-red-600">{errors.role.message}</span>
                                )}
                            </div>

                            <Button className="w-full">Enviar</Button>
                        </div>
                    </form>
                    
                </ComponentCard> 



             </Modal>

        </div>
    )
}