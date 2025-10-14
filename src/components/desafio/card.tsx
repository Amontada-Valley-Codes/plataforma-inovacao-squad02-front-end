import { CalendarClock, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import DetalhesDesafio from "./detailsDesafio";
import { ChallengeType } from "@/types/challenge";

type cardProps = {
    id: string;
    title: string;
    stats: string;
    startDate: string;
    endDate: string;
    theme: string;
    description: string;
    visibility: 'PUBLIC' | 'INTERNAL';
    isAdmin?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function Card({ 
    id, 
    title, 
    stats, 
    startDate, 
    endDate, 
    theme, 
    description, 
    visibility, 
    isAdmin = false,
    onEdit,
    onDelete 
}: cardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openDetalhes = () => setIsOpen(true);
    const closeDetalhes = () => setIsOpen(false);

    return (
        <>
            <div className="px-4 py-6 max-w-[400px] rounded-2xl border-2 border-orange-200 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="px-3 py-1 text-xs text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-full font-semibold">
                            {stats}
                        </p>
                    </div>
                </div>
                
                <div className="mt-5">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="mt-4">
                    <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-orange-100 dark:border-gray-700">
                        <CalendarClock size={18} className="text-orange-600" />
                        <p className="text-sm font-medium">{startDate} - {endDate}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <p className={`px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${
                        visibility === "PUBLIC" 
                            ? "from-green-500 to-emerald-600" 
                            : "from-orange-500 to-orange-600"
                    }`}>
                        {visibility === "PUBLIC" ? "Público" : "Privado"}
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
            
            <DetalhesDesafio
                challenge={{ id, title, stats, startDate, endDate, theme, description, visibility } as ChallengeType}
                isOpen={isOpen}
                onClose={closeDetalhes}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </>
    );
}