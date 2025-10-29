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
      await api.post("/startup", data);
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
