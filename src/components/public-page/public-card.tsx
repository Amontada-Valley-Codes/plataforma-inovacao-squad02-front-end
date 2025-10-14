import { CalendarClock } from "lucide-react";
import { useState } from "react";

type Desafio = {
  id: string;
  nome: string;
  tema: string;
  descricao: string;
  privacidade: "PUBLICO" | "INTERNO";
  dataInicio: string;
  dataFim: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type PubliCardProps = {
  desafio: Desafio;
}

export default function PubliCard({ desafio }: PubliCardProps) {
    const [isClicked, setIsClicked] = useState(false);

    const viewDetails = () => {
        setIsClicked(!isClicked);
    }

    // Formatar datas para exibição
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return "Data inválida";
        }
    };

    // Adaptar status para o formato do seu card
    const getStatus = (status: string): "ativo" | "fechado" => {
        const statusUpper = status.toUpperCase();
        return statusUpper === 'ATIVO' ? 'ativo' : 'fechado';
    };

    // Limitar a descrição para mostrar no card
    const wordLimit = 10;
    const words = desafio.descricao.split(' ');
    const isLongDescription = words.length > wordLimit;
    const shortDescription = isLongDescription 
        ? words.slice(0, wordLimit).join(' ') + '...' 
        : desafio.descricao;

    return (
        <>
            {/* Card Principal */}
            <div className="w-full max-w-[350px] sm:w-[350px] md:w-[400px] h-[265px] md:h-[220px] rounded-2xl border bg-warning-25/70 dark:bg-warning-25/20 p-5 m-2 md:p-6 mx-auto">
                <div className="flex justify-between items-center ">
                    <p className="font-bold text-sm sm:text-base truncate flex-1 mr-2" title={desafio.nome}>
                        {desafio.nome}
                    </p>
                    <p className={`px-2 py-1 text-white rounded-2xl text-xs sm:text-sm whitespace-nowrap ${
                        getStatus(desafio.status) == 'ativo' 
                            ? 'bg-gradient-to-b from-orange-400 to-orange-600' 
                            : 'bg-gradient-to-b from-red-400 to-red-600'
                    }`}>
                        {getStatus(desafio.status)}
                    </p>
                </div>
                
                {/* Descrição LIMITADA no card */}
                <div className="h-[135px] md:h-[80px] overflow-hidden mb-3 pt-4 md:pt-5">
                    <p className="text-sm sm:text-base line-clamp-3 leading-relaxed">{shortDescription}</p>
                </div>
                
                <div className="mb-3">
                    <div className="flex gap-1 items-center">
                        <CalendarClock size={18} className="flex-shrink-0"/>
                        <p className="text-xs sm:text-sm font-light italic truncate">
                            {formatDate(desafio.dataInicio)} - {formatDate(desafio.dataFim)}
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <p className="px-2 py-1 rounded-2xl text-black dark:text-white bg-gray-600/20 dark:bg-gray-600/80 text-xs sm:text-sm whitespace-nowrap">
                        {desafio.tema}
                    </p>
                    <button 
                        onClick={viewDetails} 
                        className="bg-warning-600 hover:bg-amber-500 text-white rounded px-3 py-1 text-xs sm:text-sm hover:opacity-90 transition whitespace-nowrap"
                    >
                        Ver Detalhes
                    </button>
                </div>
            </div>

            {/* Modal com descrição COMPLETA */}
            <div 
                onClick={viewDetails} 
                className={`fixed inset-0 bg-black/50 dark:bg-gray-800/20 z-[2000] backdrop-blur-sm ${
                    isClicked ? 'flex' : 'hidden'
                } items-center justify-center p-4`}
            >
                <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-black rounded-2xl shadow-lg shadow-orange-600/50 z-[2001] overflow-hidden flex flex-col"
                >
                    {/* Header do Modal - FIXO */}
                    <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex-1 mb-3 sm:mb-0">
                            <h2 className="text-xl sm:text-2xl font-bold truncate dark:text-white/80" title={`${desafio.nome} - ${desafio.tema}`}>
                                {desafio.nome} - {desafio.tema}
                            </h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`px-3 py-1 rounded-2xl text-white text-sm ${
                                    getStatus(desafio.status) == 'ativo' 
                                        ? 'bg-gradient-to-b from-orange-400 to-orange-600' 
                                        : 'bg-gradient-to-b from-red-400 to-red-600'
                                }`}>
                                    {getStatus(desafio.status)}
                                </span>
                                <span className="text-sm font-light italic text-gray-600 dark:text-gray-300">
                                    {formatDate(desafio.dataInicio)} - {formatDate(desafio.dataFim)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Conteúdo do Modal - SCROLL VERTICAL */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 dark:text-white/80">Descrição do Desafio</h3>
                                {/* Container da descrição com scroll vertical quando necessário */}
                                <div className="max-h-60 overflow-y-auto pr-2">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                                        {desafio.descricao}
                                    </p>
                                </div>
                                {/* Indicador visual de scroll (opcional) */}
                                <div className="text-xs text-gray-400 mt-2 text-center">
                                    {desafio.descricao.length > 500 && "↑↓ Role para ver mais"}
                                </div>
                            </div>
                            
                            {/* Informações Adicionais */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-2 dark:text-white/80">Tema</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{desafio.tema}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-2 dark:text-white/80">Status</h4>
                                    <p className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                        getStatus(desafio.status) == 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                        {getStatus(desafio.status)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-2 dark:text-white/80">Privacidade</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {desafio.privacidade === 'PUBLICO' ? 'Público' : 'Interno'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-2 dark:text-white/80">Período</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {formatDate(desafio.dataInicio)} até {formatDate(desafio.dataFim)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer do Modal - FIXO */}
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex justify-end">
                            <button 
                                onClick={viewDetails} 
                                className="bg-warning-600 text-white rounded-lg px-6 py-2 hover:bg-warning-500 transition font-medium"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}