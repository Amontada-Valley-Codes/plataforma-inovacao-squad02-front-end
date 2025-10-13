import { useContext, useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Ideias from "./Ideias";
import { Calendar, Eye, Globe, Lock, Tag } from "lucide-react";
import api from "@/services/axiosServices";
import { IdeiaType } from "@/types/ideia";
import { ThemeContext } from "@/context/ThemeContext";
import { ChallengeType } from "@/types/challenge";

type Props = {
    challenge: ChallengeType;
    isOpen: boolean;
    onClose: () => void;
};

export default function DetalhesDesafio({challenge, isOpen, onClose}: Props) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) {
        throw new Error("ThemeContext must be used within a ThemeProvider");
    }
    const { theme: currentTheme } = themeContext;
    const [ideias, setIdeias] = useState<IdeiaType[]>([]);

    useEffect(() => {
        if (isOpen && challenge.id) {
            api.get(`/ideas/challenge/${challenge.id}`)
                .then(res => setIdeias(res.data))
                .catch(() => setIdeias([]));
        }
    }, [isOpen, challenge.id]);
    console.log(ideias);

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('ativo') || statusLower.includes('active')) {
            return currentTheme === 'dark' ? 'bg-gradient-to-r from-green-700 to-emerald-800' : 'bg-gradient-to-r from-green-500 to-emerald-600';
        }
        if (statusLower.includes('pendente') || statusLower.includes('pending')) {
            return currentTheme === 'dark' ? 'bg-gradient-to-r from-yellow-700 to-amber-800' : 'bg-gradient-to-r from-yellow-500 to-amber-600';
        }
        if (statusLower.includes('concluído') || statusLower.includes('completed')) {
            return currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-indigo-800' : 'bg-gradient-to-r from-blue-500 to-indigo-600';
        }
        return currentTheme === 'dark' ? 'bg-gradient-to-r from-orange-700 to-amber-800' : 'bg-gradient-to-r from-orange-500 to-amber-600';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`bg-gradient-to-br ${currentTheme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-white to-orange-50'} rounded-t-2xl`}>
                {/* Header com gradiente */}
                <div className={`bg-gradient-to-r ${currentTheme === 'dark' ? 'from-gray-700 to-gray-800' : 'from-orange-500 to-amber-600'} px-6 py-5 rounded-t-2xl`}>
                    <h2 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-white'}`}>{challenge.title}</h2>
                </div>

                {/* Conteúdo */}
                <div className={`p-6 space-y-4 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : ''}`}>
                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-orange-50 border-orange-100'} px-3 py-2 rounded-lg border`}>
                            <Eye className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-orange-600'}`} />
                            <span className={`font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status:</span>
                        </div>
                        <span className={`${getStatusColor(challenge.stats)} px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm`}>
                            {challenge.stats}
                        </span>
                    </div>

                    {/* Tema */}
                    <div className={`bg-gradient-to-r ${currentTheme === 'dark' ? 'from-gray-700 to-gray-800 border-gray-600' : 'from-orange-50 to-amber-50 border-orange-100'} p-4 rounded-xl border-2`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className={`w-5 h-5 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-orange-600'}`} />
                            <span className={`font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tema:</span>
                        </div>
                        <p className={`${currentTheme === 'dark' ? 'text-gray-400' : 'text-orange-700'} font-medium ml-7`}>{challenge.theme}</p>
                    </div>

                    {/* Descrição */}
                    <div className={`p-4 rounded-xl border-2 shadow-sm ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-orange-100 text-gray-600'}`}>
                        <span className={`font-semibold block mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descrição:</span>
                        <p className="leading-relaxed">{challenge.description}</p>
                    </div>

                    {/* Data */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'}`}>
                        <Calendar className={`w-5 h-5 flex-shrink-0 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-orange-600'}`} />
                        <div>
                            <span className={`font-semibold block text-sm mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Período:</span>
                            <span className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{challenge.startDate} → {challenge.endDate}</span>
                        </div>
                    </div>

                    {/* Visibilidade */}
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-orange-50 border-orange-100'} px-3 py-2 rounded-lg border`}>
                            <span className={`font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Visibilidade:</span>
                        </div>
                        {challenge.visibility === 'PUBLIC' ? (
                            <span className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm ${currentTheme === 'dark' ? 'bg-gradient-to-r from-green-700 to-emerald-800' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
                                <Globe className="w-4 h-4" />
                                Público
                            </span>
                        ) : (
                            <span className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm ${currentTheme === 'dark' ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-slate-600 to-slate-700'}`}>
                                <Lock className="w-4 h-4" />
                                Interno
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Seção de Ideias */}
            <div className={`border-t-2 ${currentTheme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
                <Ideias ideias={ideias} challengeId={challenge.id} />
            </div>
        </Modal>
    );
}