import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Ideias from "./Ideias";
import { Calendar, Eye, Globe, Lock, Tag } from "lucide-react";
import api from "@/services/axiosServices";
import { IdeiaType } from "@/types/ideia";

type Props = {
    id: string; // Adicione o id do desafio
    title: string;
    stats: string;
    startDate: string;
    endDate: string;
    theme: string;
    description: string;
    visibility: 'PUBLIC' | 'INTERNAL';
    isOpen: boolean;
    onClose: () => void;
};

export default function DetalhesDesafio({
    id,
    isOpen,
    onClose,
    title,
    stats,
    description,
    startDate,
    endDate,
    theme,
    visibility
}: Props) {
    const [ideias, setIdeias] = useState<IdeiaType[]>([]);

    useEffect(() => {
        if (isOpen && id) {
            api.get(`/ideas/challenge/${id}`)
                .then(res => setIdeias(res.data))
                .catch(() => setIdeias([]));
        }
    }, [isOpen, id]);
    console.log(ideias);

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('ativo') || statusLower.includes('active')) {
            return 'bg-gradient-to-r from-green-500 to-emerald-600';
        }
        if (statusLower.includes('pendente') || statusLower.includes('pending')) {
            return 'bg-gradient-to-r from-yellow-500 to-amber-600';
        }
        if (statusLower.includes('concluído') || statusLower.includes('completed')) {
            return 'bg-gradient-to-r from-blue-500 to-indigo-600';
        }
        return 'bg-gradient-to-r from-orange-500 to-amber-600';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-t-2xl">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-5 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-4">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                            <Eye className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-gray-700">Status:</span>
                        </div>
                        <span className={`${getStatusColor(stats)} px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm`}>
                            {stats}
                        </span>
                    </div>

                    {/* Tema */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-5 h-5 text-orange-600" />
                            <span className="font-semibold text-gray-700">Tema:</span>
                        </div>
                        <p className="text-orange-700 font-medium ml-7">{theme}</p>
                    </div>

                    {/* Descrição */}
                    <div className="bg-white p-4 rounded-xl border-2 border-orange-100 shadow-sm">
                        <span className="font-semibold text-gray-700 block mb-2">Descrição:</span>
                        <p className="text-gray-600 leading-relaxed">{description}</p>
                    </div>

                    {/* Data */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-100">
                        <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-700 block text-sm mb-1">Período:</span>
                            <span className="text-gray-700 font-medium">{startDate} → {endDate}</span>
                        </div>
                    </div>

                    {/* Visibilidade */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                            <span className="font-semibold text-gray-700">Visibilidade:</span>
                        </div>
                        {visibility === 'PUBLIC' ? (
                            <span className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm">
                                <Globe className="w-4 h-4" />
                                Público
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm">
                                <Lock className="w-4 h-4" />
                                Interno
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Seção de Ideias */}
            <div className="border-t-2 border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
                <Ideias ideias={ideias}/>
            </div>
        </Modal>
    );
}