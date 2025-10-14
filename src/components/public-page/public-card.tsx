import { CalendarClock } from "lucide-react";
// import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";

type cardProps = {
    title: string,
    stats: "ativo" | "fechado",
    description: string,
    dateInicial: string,
    datefinal: string,
    empresa: string
}

export default function PubliCard({ title, stats, description, dateInicial, datefinal, empresa }: cardProps) {
    const [isClicked, setIsClicked] = useState(false);

    const viewDetails = () => {
        setIsClicked(!isClicked);
    }

    // Limitar a descrição para mostrar no card
    const wordLimit = 10;
    const words = description.split(' ');
    const isLongDescription = words.length > wordLimit;
    const shortDescription = isLongDescription 
        ? words.slice(0, wordLimit).join(' ') + '...' 
        : description;

    return (
        <>
            {/* Card Principal */}
            <div className="w-full max-w-[350px] sm:w-[350px] md:w-[400px] h-[265px] md:h-[220px] rounded-2xl border bg-warning-25/70 p-5 m-2 md:p-6 mx-auto">
                <div className="flex justify-between items-center ">
                    <p className="font-bold text-sm sm:text-base truncate flex-1 mr-2" title={title}>
                        {title}
                    </p>
                    <p className={`px-2 py-1 text-white rounded-2xl text-xs sm:text-sm whitespace-nowrap ${
                        stats == 'ativo' 
                            ? 'bg-gradient-to-b from-orange-400 to-orange-600' 
                            : 'bg-gradient-to-b from-red-400 to-red-600'
                    }`}>
                        {stats}
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
                            {dateInicial} - {datefinal}
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <p className="px-2 py-1 rounded-2xl text-white bg-[var(--HHlaranjafraco)] text-xs sm:text-sm whitespace-nowrap">
                        {empresa}
                    </p>
                    <button 
                        onClick={viewDetails} 
                        className="bg-[var(--HHlaranjaforte)] text-white rounded px-3 py-1 text-xs sm:text-sm hover:opacity-90 transition whitespace-nowrap"
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
                    {/* Header do Modal */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex-1 mb-3 sm:mb-0">
                            <h2 className="text-xl sm:text-2xl font-bold truncate dark:text-white/80" title={`${title} - ${empresa}`}>
                                {title} - {empresa}
                            </h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`px-3 py-1 rounded-2xl text-white text-sm ${
                                    stats == 'ativo' 
                                        ? 'bg-gradient-to-b from-orange-400 to-orange-600' 
                                        : 'bg-gradient-to-b from-red-400 to-red-600'
                                }`}>
                                    {stats}
                                </span>
                                <span className="text-sm font-light italic text-gray-600 dark:text-gray-300">
                                    {dateInicial} - {datefinal}
                                </span>
                            </div>
                        </div>
                        
                        {/* <button 
                            onClick={viewDetails} 
                            className="self-end sm:self-auto text-2xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <RiCloseLargeLine />
                        </button> */}
                    </div>
                    
                    {/* Conteúdo do Modal */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2 dark:text-white/80">Descrição do Projeto</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {description}
                            </p>
                        </div>
                        
                        {/* Informações Adicionais (opcional) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <h4 className="font-semibold text-sm mb-1 dark:text-white/80">Empresa</h4>
                                <p className="text-gray-600 dark:text-gray-400">{empresa}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <h4 className="font-semibold text-sm mb-1 dark:text-white/80">Status</h4>
                                <p className={`inline-block px-2 py-1 rounded text-xs ${
                                    stats == 'ativo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}>
                                    {stats}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer do Modal (opcional) */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex justify-end">
                            <button 
                                onClick={viewDetails} 
                                className="bg-[var(--HHlaranjaforte)] text-white rounded-lg px-6 py-2 hover:opacity-90 transition"
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