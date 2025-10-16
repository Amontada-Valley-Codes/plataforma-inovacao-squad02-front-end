// "use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/axiosServices";
import { Button } from "@/components/ui/button";
import TextArea from "../form/input/TextArea";

const commentSchema = z.object({
    text: z.string().min(1, "O comentário não pode estar vazio")
});

type CommentFormData = z.infer<typeof commentSchema>;

type CommentFormProps = {
    ideaId: string;
    handleAddCommentClickComment?: () => void;
};

export default function CommentForm({ ideaId, handleAddCommentClickComment }: CommentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    });
    const onSubmit = async (data: CommentFormData) => {
        const dataToSend = {
            ideaId,
            text: data.text,
        };

        try {
            const response = await api.post("/idea-comments", dataToSend);
            console.log("Comentário enviado com sucesso:", response.data);
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
        }
        finally {
            handleAddCommentClickComment();
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="text">Deixe seu Comentário</label>
                    <textarea
                        id="text"
                        {...register("text")}
                        placeholder="Escreva seu comentário aqui..."
                        className="w-full p-2 border rounded-md"
                    />
                    {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
                </div>
                <Button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-md">
                    Enviar Comentário
                </Button>
            </form>
        </div>
    );
}