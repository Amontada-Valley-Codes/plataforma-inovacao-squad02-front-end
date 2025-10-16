import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/axiosServices";

import Button from "../ui/button/Button";
import Swal from "sweetalert2";

const formSchema = z
    .object({
        title: z.string().min(2, "Digite pelo menos 2 letras"),
        description: z.string().min(3, "Digite uma descrição mais completa"),
    });

type FormData = z.infer<typeof formSchema>;

type FormIdeaProps = {
    challengeId: string;
    handleAddCommentClickIdea: () => void;
};

export default function FormIdea({ challengeId, handleAddCommentClickIdea }: FormIdeaProps) {
    const [formData, setFormData] = useState<FormData | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setFormData(data);
        const dataToSend = {
            ...data,
            challengeId: challengeId,
        };

        try {
            const response = await api.post("/ideas", dataToSend);
            console.log("Ideia enviada com sucesso:", response.data);
            setFormData(null);
            Swal.fire("Sucesso!", "Ideia enviada com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao enviar ideia:", error);
        }
        handleAddCommentClickIdea();
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Título
                    </label>
                    <input
                        id="title"
                        {...register("title")}
                        className="w-full p-2 border rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Descrição
                    </label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="w-full p-2 border rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}