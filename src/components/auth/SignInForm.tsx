"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {  EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import api from "@/services/axiosServices";
import Image from "next/image";
import { getUserRole } from "@/utils/getUserRole";



const formSchema = z.object({
  email: z.string().min(5, "o e-mail deve ter pelo menos 5 caracteres."),
  password: z.string().min(3, "o senha deve ter pelo menos 3 caracteres.")
})  


type FormData = z.infer<typeof formSchema>

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const{
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } =  useForm<FormData>({
      resolver: zodResolver(formSchema),
    });



  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try{
      const response = await api.post("/auth/login",{
      email:data.email,
      password:data.password
    })

    const role = getUserRole();
    const {access_token, user } = response.data


    
    localStorage.setItem("token", access_token);
    
    toast.success("Sucesso! Operação realizada.");
    router.push('/deshboard');

     if (role === "ADMIN") {
      router.push("/deshboard");
    } else if (role === "MANAGER") {
      router.push("/Usuarios");
    } else if (role === "EVALUATOR") {
      router.push("/desafio");
    } else {
      router.push("/deshboard");
    }
    reset()
    }catch(error){
      console.error('Erro ao entar', error)
      toast.error("Email ou Senha Invalidos!");

    } finally {
        setLoading(false);
    }
   
  }


  return (
    <div className="flex justify-center items-center w-full">
         <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md px-3 space-y-8" >
               <div className="bg-white dark:bg-gray-800 rounded-3xl py-10   space-y-8 p-5">
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
                <div className="">
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="info@gmail.com" 
                    type="email"
                    {...register("email")}
                    max="30"
                    min="3"
                   />
                </div>
                 {errors.email &&(
                <span className=" text-red-600">{errors.email.message}</span>
              )}
                <div>
                  <Label>
                    Senha <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      {...register("password")}
                      
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon/>
                      ) : (
                        <EyeCloseIcon />
                      )}
                    </span>
                    {errors.password &&(
                <span className=" text-red-600">{errors.password.message}</span>
              )}
                  </div>
                </div>
                <div>

          
                  <Button className="w-full " variant="primary" size="sm">
                     {loading ? "Enviando..." : "Entrar"}
                  </Button>
                  
                </div>
              </div>
            
            </form>

           
          </div>
     
  );
}
