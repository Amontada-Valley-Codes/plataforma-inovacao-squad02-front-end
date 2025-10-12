import { FaHeart } from "react-icons/fa";
import { MessageSquareText, PlusCircle } from 'lucide-react';
import { IdeiaType } from "@/types/ideia";
import { useState, useEffect } from "react";
import CommentList from "./commentList";
import api from "@/services/axiosServices";
import { CommentType } from "@/types/comment";
import { set } from "zod";
// import FormIdea from "./FormIdea";


type Props = {
    Ideia: IdeiaType;
}

export default function Ideia({ Ideia }: Props) {
    const [isLikedState, setIsLikedState] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [countLike, setCountLike] = useState(0);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (Ideia.id) {
            api.get(`/idea-likes/${Ideia.id}/count`)
                .then(res => setCountLike(res.data.likes))
                .catch(() => setCountLike(0));
        }
    }, [Ideia.id, isLikedState]);

    useEffect(() => {
        if (Ideia.id) {
            api.get(`/idea-likes/${Ideia.id}/status`)
                .then(res => setIsLikedState(res.data.liked))
                .catch(() => setIsLikedState(false));
        }
    }, [Ideia.id]);

    const toggleLike = async () => {
        try {
            if (isLikedState) {
                await api.delete(`/idea-likes/${Ideia.id}`);
            } else {
                await api.post(`/idea-likes/${Ideia.id}`);
            }

        const res = await api.get(`/idea-likes/${Ideia.id}/count`);
        setCountLike(res.data.likes);

        setIsLikedState(!isLikedState);
        } catch (error) {
            console.error("Erro ao atualizar like", error);
        }
    };

    const handleCommentsClick = async () => {
        setShowComments(!showComments);
        if (!showComments && Ideia.id) {
            setLoadingComments(true);
            try {
                const res = await api.get(`/idea-comments/idea/${Ideia.id}`);
                setComments(res.data);
            } catch {
                setComments([]);
            }
            console.log(comments);
            setLoadingComments(false);
        }
    };

    const handleAddCommentClick = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-150 dark:border-gray-900">
            <div className="flex items-center mb-2">
                <img src={"../images/user/user-01.jpg"} alt={Ideia.author.name} className="h-10 w-10 rounded-full mr-3 border-2 border-gray-300" />
                <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{Ideia.author.name}</p>
                    <p className="text-gray-700 dark:text-gray-200">{Ideia.title}</p>
                    <p className="text-gray-500 dark:text-gray-400">{Ideia.description}</p>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">{Ideia.createdAt}</p>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 transition-colors" onClick={toggleLike}>
                        <FaHeart color={isLikedState ? '#fb6514' : '#d0d5dd'} />
                        <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{countLike}</h1>
                    </button>
                    <button
                        className="flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-orange-600 transition-colors"
                        onClick={handleCommentsClick}
                    >
                        <MessageSquareText size={18} />
                        <span className="ml-1 text-xs">
                            Ver comentários
                        </span>
                    </button>
                    <button
                        className="flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-orange-600 transition-colors"
                        onClick={handleAddCommentClick}
                    >
                        <PlusCircle size={18} />
                        <span className="ml-1 text-xs">
                            Adicionar comentário
                        </span>
                    </button>
                </div>
            </div>
            {showComments && (
                <div className="mt-4 bg-orange-50 dark:bg-orange-950 rounded p-3">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Comentários</h4>
                    {loadingComments ? (
                        <p className="text-gray-500 dark:text-gray-400">Carregando comentários...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Nenhum comentário ainda.</p>
                    ) : (
                        <ul className="space-y-2">
                            <CommentList comments={comments} />
                        </ul>
                    )}
                </div>
            )}
            {showForm && (
                <div className="mt-4 bg-orange-50 dark:bg-orange-950 rounded p-3">
                    {/* <FormIdea ideiaId={Ideia.id} /> */}
                </div>
            )}
        </div>
    );
}