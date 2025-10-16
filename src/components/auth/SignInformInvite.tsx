"use client"

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useForm } from "react-hook-form";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "@/services/axiosServices";
import Button from "../ui/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeCloseIcon } from "@/icons";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(3, "o nome deve ter pelo menos 3 caracteres."),
  password: z.string().min(3, "a senha deve ter pelo menos 3 caracteres.")
})  

type FormData = z.infer<typeof formSchema>

export default function SignInFormInvite(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
      handleSubmit,
      register,
      reset,
      formState: {errors}
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const onSubimit = async (data: FormData) =>{
        setLoading(true);
        try{
            const response = await api.post('/auth/register/invite',{
            token,
            name: data.name,
            password: data.password
        });
        toast.success("Cadastro realizado com sucesso!"); 
        window.history.replaceState(null, '', window.location.pathname);
        console.log("Resposta do servidor:", response.data);
        reset()
        router.push('/signin');

        }catch(error){
             console.error('Erro ao entar', error)
        }finally {
        setLoading(false);
        }
    }

    return(
        <div className="flex justify-center items-center w-full">
          <form onSubmit={handleSubmit(onSubimit)} className="w-full max-w-md px-3 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl py-10 space-y-8 p-5">
              <div className="flex justify-center">
                <Image
                    src="/HiveHub-logopreto.png"
                    alt="Logo HiveHub"
                    width={160} 
                    height={64}
                    className="w-40"
                    priority
                />
                </div>

              <div>
                <Label>Digite seu nome: <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="Nome"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-600">{errors.name.message}</span>
                )}
              </div>

              <div>
                <Label>Digite sua Senha: <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    placeholder="Senha"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                  {errors.password && (
                    <span className="text-red-600">{errors.password.message}</span>
                  )}
                </div>
              </div>

              <div>
                <Button className="w-full" variant="primary" size="sm">
                  {loading ? "Enviando..." : "Entrar"}
                </Button>
              </div>
            </div>
          </form>
        </div>
    )
}
