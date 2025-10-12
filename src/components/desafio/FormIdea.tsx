
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/axiosServices";

import Button from "../ui/button/Button";
import TextArea from "@/components/form/input/TextArea";



const formSchema = z
    .object({
        title: z.string().min(2, "Digite pelo menos 2 letras"),
        description: z.string().min(3, "Digite uma descrição mais completa"),
    });

type FormData = z.infer<typeof formSchema>;

export default function FormIdea(challengeId: string) {
    const [formData, setFormData] = useState<FormData | null>(null);
    const {     
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data: FormData) => {
        setFormData(data);
        const dataToSend = {
            ...data,
            challengeId: challengeId
        }

        try {
            const response = await api.post('/ideas', dataToSend);
            console.log('Ideia enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar ideia:', error);
        }

    };

return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title">Título</label>
                    <input id="title" {...register("title")} />
                    {errors.title && <p>{errors.title.message}</p>}
                </div>
                <div>
                    <label htmlFor="description">Descrição</label>
                    <textarea id="description" {...register("description")} />
                    {errors.description && <p>{errors.description.message}</p>}
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}