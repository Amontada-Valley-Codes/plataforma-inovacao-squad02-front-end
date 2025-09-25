"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {  EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const formSchema = z.object({
  login: z.string().min(5, "o e-mail deve ter pelo menos 5 caracteres."),
  senha: z.string().min(3, "o senha deve ter pelo menos 3 caracteres.")
})  


type FormData = z.infer<typeof formSchema>

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  
  const{
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } =  useForm<FormData>({
      resolver: zodResolver(formSchema),
    });

  const onSubmit = (data: FormData) => {
    console.log(data)
    toast.success("Sucesso! Operação realizada.");
    reset()
  }


  return (
    <div>
         <form onSubmit={handleSubmit(onSubmit)} >
               <div className="bg-white rounded-3xl py-10 px-6  space-y-8">
                 <div className="flex justify-center">
                   <img src="/HiveHub-logopreto.png" alt="" className="w-40" />
                </div>
                <div className="">
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="info@gmail.com" 
                    type="email"
                    {...register("login")}
                    max="30"
                    min="3"
                   />
                </div>
                 {errors.login &&(
                <span className=" text-red-600">{errors.login.message}</span>
              )}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("senha")}
                      
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
                    {errors.senha &&(
                <span className=" text-red-600">{errors.senha.message}</span>
              )}
                  </div>
                </div>
                <div>

          
                  <Button className="w-full" size="sm">
                    Entrar
                  </Button>
                  
                </div>
              </div>
            
            </form>

           
          </div>
     
  );
}
