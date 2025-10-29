import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formSchema, FormData } from "@/types/startup";
import api from "@/services/axiosServices";
import Swal from "sweetalert2";

export const useStartupForm = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      founders: [""],
      links: [""],
    },
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray<any>({
    control,
    name: "links",
  });

  const {
    fields: founderFields,
    append: appendFounder,
    remove: removeFounder,
  } = useFieldArray<any>({
    control,
    name: "founders",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/startup/create/user", data);
      const { newStartup,usaerStartup } = response.data;

      reset({
        founders: [""],
        links: [""],
      });
      onSuccess();

      Swal.fire({
        title: "Sucesso!",
        icon: "success",
        text: "Startup cadastrada com sucesso!",
      });

     
      const message = `
Olá! 🎉 Sua startup *${newStartup.name}* foi cadastrada com sucesso na plataforma! 🚀
Acesse o link para finalizar o cadastro.
${usaerStartup.inviteLink}
`;
      const phone = data.userPhone.replace(/\D/g, "");
      const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank");
      console.log(response.data)
    } catch (err) {
      console.error("Erro ao cadastrar startup:", err);
      setError("Erro ao cadastrar startup. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    reset,
    control,
    errors,
    linkFields,
    appendLink,
    removeLink,
    founderFields,
    appendFounder,
    removeFounder,
    onSubmit,
    isSubmitting,
    error,
  };
};
