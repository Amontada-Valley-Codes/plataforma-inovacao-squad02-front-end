import { CalendarClock, Building2, Users, Target, Link, AlertCircle } from "lucide-react"

type StartupCardProps = {
    name: string;
    cnpj: string;
    segment: string[];
    technologies: string[];
    stage: string;
    problems: string;
    location: string;
    founders: string[];
    pitch: string;
    links: string[];
    createdAt: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

export default function StartupCard({ 
    name, 
    cnpj, 
    segment, 
    technologies, 
    stage, 
    problems, 
    location, 
    founders, 
    pitch, 
    links, 
    createdAt,
    isExpanded = false,
    onToggleExpand 
}: StartupCardProps) {
  
    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-[400px] w-full overflow-hidden">
           
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Building2 size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg truncate max-w-[200px]">{name}</h3>
                            <p className="text-blue-100 text-sm">Startup</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
                
                {/* Pitch/Descrição */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-500">Pitch</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed line-clamp-3">{pitch}</p>
                </div>

                {/* Informações principais */}
                <div className="space-y-4">
                    {/* Data de criação */}
                    <div className="flex items-center gap-3 p-3 rounded-lg">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <CalendarClock size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Criado em</p>
                            <p className="text-gray-900 font-medium">{createdAt}</p>
                        </div>
                    </div>

                    {/* Localização */}
                    <div className="flex items-center gap-3 p-3 rounded-lg">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Target size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Localização</p>
                            <p className="text-gray-900 font-medium">{location}</p>
                        </div>
                    </div>

                    {/* Estágio */}
                    <div className="flex items-center gap-3 p-3 rounded-lg">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <AlertCircle size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estágio</p>
                            <p className="text-gray-900 font-medium">{stage}</p>
                        </div>
                    </div>

                    {/* Informações compactadas */}
                    {!isExpanded && (
                        <>
                            {/* CNPJ e Status */}
                            <div className="flex justify-between items-center p-3 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">CNPJ</p>
                                    <p className="text-gray-900 font-mono font-semibold text-sm">
                                        {cnpj}
                                    </p>
                                </div>
                                <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                                    {stage}
                                </div>
                            </div>

                            {/* Botão Ver Mais */}
                            <button 
                                onClick={onToggleExpand}
                                className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                            >
                                Ver mais detalhes
                            </button>
                        </>
                    )}

                    {/* Informações expandidas */}
                    {isExpanded && (
                        <div className="space-y-4 border-t pt-4">
                            {/* Segmentos */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Segmentos</p>
                                <div className="flex flex-wrap gap-2">
                                    {segment.map((seg, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                        >
                                            {seg}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tecnologias */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Tecnologias</p>
                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Problema */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Problema que resolve</p>
                                <p className="text-gray-700 text-sm">{problems}</p>
                            </div>

                            {/* Fundadores */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fundadores</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {founders.map((founder, index) => (
                                            <span key={index} className="text-gray-900 font-medium text-sm">
                                                {founder}{index < founders.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            {links.length > 0 && links[0] && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Link size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Links</p>
                                        <a 
                                            href={links[0]} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium break-all"
                                        >
                                            {links[0]}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Botão Ver Menos */}
                            <button 
                                onClick={onToggleExpand}
                                className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                            >
                                Ver menos
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}