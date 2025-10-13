'use client'
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import TextArea from "@/components/form/input/TextArea";
import api from "@/services/axiosServices";
import { toast, Toaster } from "sonner"
import { useEffect, useState } from "react";
import Cards from "@/components/empresa/Cards";



const formSchema = z.object({
    name:z.string().min(2, 'digite pelo menos 2 letras'),
    cnpj:z.string().max(14, "cnpj invalido"),
    description:z.string().min(3, 'digite pelo menos uma descriçao mais completa'),
    managerName:z.string().min(2, 'digite pelo menos 2 letras'),
    managerEmail:z.string().min(5, 'email muito curto'),
    managerPassword:z.string().min(3, 'senha muito curta')
})

type FormData = z.infer<typeof formSchema>


type Empresa = {
    name:string,
    cnpj: string,
    description:string,
    createdAt: string, 
}


export default function  Page(){
    const { isOpen, openModal, closeModal } = useModal();
     const [empresas, setEmpresas] = useState<Empresa[]>([])
    

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState:{errors}
    }=useForm<FormData>({
        resolver:zodResolver(formSchema)
    })

   useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await api.get<Empresa[]>("/empresas");
        setEmpresas(res.data); 
        console.log("Empresas:", res.data);
      } catch (erro) {
        console.error("Erro ao Cadastra uma empresa", erro);
      }
      
    };

    fetchEmpresas();
  }, []);


    const onSubmit = async (data:FormData)=>{

        try{
            const response = await api.post('/empresas/with-manager', data)
            console.log(response.data)
            toast.success("Sucesso! Empresa Cadastrada!");
            setEmpresas((prev) => [...prev, response.data])

        }catch(error){
            console.error('erro ao cadastar', error)
            toast.error("erro no cadastro")
        }
        
        reset()
        closeModal()
    }

    return(
        <div>
            <Toaster position="top-center" richColors />
            <div className="flex justify-between">
              

            <p className="text-2xl">Cadastro de Empresa</p>
            <Button onClick={openModal} size="sm" variant="primary">Nova Empresa</Button>
                
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {empresas.map((empresa) => (
                <Cards
                    key={empresa.cnpj}
                    name={empresa.name}
                    cnpj={empresa.cnpj}
                    description={empresa.description}
                    createdAt={empresa.createdAt}
                    />
                ))}
                </div>


            
     
            <div >
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <ComponentCard title="Criar nova empresa">
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                            <Label>Nome:</Label>
                            <Input
                            type="text"
                            placeholder="Digite nome da empresa"
                            {...register('name')}
                            />
                            {errors.name && (
                                <span className="text-red-600"
                                >
                                    {errors.name.message}
                                </span>
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
                                <span className="text-red-600">
                                    {errors.cnpj.message}
                                </span>
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
                                <Label>Nome Gerente</Label>
                                <Input
                                type="text"
                                placeholder="Digite o o nome"
                                {...register('managerName')}
                                />
                                {errors.managerName && (
                                    <span className="text-red-600">{errors.managerName.message}</span>
                                )}
                            </div>

                            <div>
                                 <Label>Email Gerente</Label>
                                <Input
                                type="text"
                                placeholder="Digite o email gerente"
                                {...register('managerEmail')}
                                />
                                {errors.managerEmail && (
                                    <span className="text-red-600">{errors.managerEmail.message}</span>
                                )}

                            </div>
                            <div>
                                  <Label>Senha Gerente</Label>
                                <Input
                                type="text"
                                placeholder="Digite o senha gerente"
                                {...register('managerPassword')}
                                />
                                {errors.managerPassword && (
                                    <span className="text-red-600">{errors.managerPassword.message}</span>
                                )}

                            </div>

                            <div>
                                <Button className="w-full mt-2" size="sm">Enviar</Button>
                            </div>
                            

                            
                        </form>
                    </ComponentCard>
                    
                    
                </Modal>
            </div>
           

        </div>
    )
}