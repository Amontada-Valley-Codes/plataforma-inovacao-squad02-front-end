import { CalendarClock, Building2, Users, Target, Link, AlertCircle, MapPin, Code, Puzzle, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";

type StartupCardProps = {
    id: string;
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
    isAdmin?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function StartupCard({ 
    id,
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
    isAdmin = false,
    onEdit,
    onDelete 
}: StartupCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openDetalhes = () => setIsOpen(true);
    const closeDetalhes = () => setIsOpen(false);

    // Formatar data
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return "Data inválida";
        }
    };

    // Cor do estágio baseado no status
    const getStageColor = (stage: string) => {
        const stageLower = stage.toLowerCase();
        if (stageLower.includes('seed') || stageLower.includes('inicial') || stageLower.includes('early')) {
            return "from-green-500 to-emerald-600";
        } else if (stageLower.includes('growth') || stageLower.includes('crescimento')) {
            return "from-blue-500 to-blue-600";
        } else if (stageLower.includes('scale') || stageLower.includes('escala')) {
            return "from-purple-500 to-purple-600";
        } else {
            return "from-orange-500 to-amber-600";
        }
    };

    return (
        <>
            <div className="px-4 py-6 max-w-[400px] rounded-2xl border-2 border-orange-200 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Building2 size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="font-bold text-gray-800 dark:text-gray-100 truncate max-w-[180px]">{name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className={`px-3 py-1 text-xs text-white bg-gradient-to-r rounded-full font-semibold ${getStageColor(stage)}`}>
                            {stage}
                        </p>
                    </div>
                </div>
                
                {/* Pitch/Descrição */}
                <div className="mt-5">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                        {pitch}
                    </p>
                </div>

                {/* Informações principais */}
                <div className="mt-4 space-y-3">
                    {/* Localização */}
                    <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-orange-100 dark:border-gray-700">
                        <MapPin size={18} className="text-orange-600" />
                        <p className="text-sm font-medium">{location}</p>
                    </div>

                    {/* Data de criação */}
                    <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-orange-100 dark:border-gray-700">
                        <CalendarClock size={18} className="text-orange-600" />
                        <p className="text-sm font-medium">Criado em {formatDate(createdAt)}</p>
                    </div>

                    {/* Segmento principal */}
                    <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-orange-100 dark:border-gray-700">
                        <Puzzle size={18} className="text-orange-600" />
                        <p className="text-sm font-medium">{segment[0] || "Startup"}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4">
                    <p className="px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600">
                        {technologies.length} techs
                    </p>
                    <Button 
                        onClick={openDetalhes} 
                        size="sm" 
                        variant="primary"
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold"
                    >
                        Ver Detalhes
                    </Button>
                </div>
            </div>
            
            {/* Modal de Detalhes - Similar ao DetalhesDesafio */}
            <StartupDetalhes
                startup={{ 
                    id, name, cnpj, segment, technologies, stage, 
                    problems, location, founders, pitch, links, createdAt 
                }}
                isOpen={isOpen}
                onClose={closeDetalhes}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </>
    );
}

// Componente Modal de Detalhes (similar ao DetalhesDesafio)
interface StartupDetalhesProps {
    startup: StartupCardProps;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

function StartupDetalhes({ startup, isOpen, onClose, isAdmin, onEdit, onDelete }: StartupDetalhesProps) {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return "Data inválida";
        }
    };

    const getStageColor = (stage: string) => {
        const stageLower = stage.toLowerCase();
        if (stageLower.includes('seed') || stageLower.includes('inicial') || stageLower.includes('early')) {
            return "bg-gradient-to-r from-green-500 to-emerald-600";
        } else if (stageLower.includes('growth') || stageLower.includes('crescimento')) {
            return "bg-gradient-to-r from-blue-500 to-blue-600";
        } else if (stageLower.includes('scale') || stageLower.includes('escala')) {
            return "bg-gradient-to-r from-purple-500 to-purple-600";
        } else {
            return "bg-gradient-to-r from-orange-500 to-amber-600";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-gray-800/20 z-[2000] backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-orange-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-orange-600" />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{startup.name}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${getStageColor(startup.stage)}`}>
                                {startup.stage}
                            </span>
                            {isAdmin && (
                                <div className="flex gap-2">
                                    {/* Usando variant outline ou sem variant para botões secundários */}
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={onEdit}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={onDelete}
                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">CNPJ: {startup.cnpj}</p>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-6">
                        {/* Pitch */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Pitch</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{startup.pitch}</p>
                        </div>

                        {/* Problema */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Problema que Resolve</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{startup.problems}</p>
                        </div>

                        {/* Informações Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Localização */}
                            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-800 rounded-lg">
                                <MapPin className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Localização</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">{startup.location}</p>
                                </div>
                            </div>

                            {/* Data de Criação */}
                            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-800 rounded-lg">
                                <CalendarClock className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Criado em</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">{formatDate(startup.createdAt)}</p>
                                </div>
                            </div>

                            {/* Fundadores */}
                            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-800 rounded-lg">
                                <Users className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Fundadores</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                                        {startup.founders.join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* Tecnologias */}
                            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-800 rounded-lg">
                                <Code className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Tecnologias</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                                        {startup.technologies.length} tecnologias
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Segmentos */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Segmentos</h3>
                            <div className="flex flex-wrap gap-2">
                                {startup.segment.map((seg, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium"
                                    >
                                        {seg}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tecnologias */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Tecnologias</h3>
                            <div className="flex flex-wrap gap-2">
                                {startup.technologies.map((tech, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        {startup.links.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Links</h3>
                                <div className="space-y-2">
                                    {startup.links.map((link, index) => (
                                        <a 
                                            key={index}
                                            href={link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium break-all"
                                        >
                                            <Link className="w-4 h-4" />
                                            {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <Button 
                        onClick={onClose}
                        variant="primary"
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold"
                    >
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}