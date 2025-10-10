import { CalendarClock } from "lucide-react";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import DetalhesDesafio from "./detailsDesafio";

type cardProps = {
    id: string;
    title: string;
    stats: string;
    startDate: string;
    endDate: string;
    theme: string;
    description: string;
    visibility: 'PUBLIC' | 'INTERNAL';
};

export default function Card({ id, title, stats, description, startDate, endDate, theme, visibility }: cardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openDetalhes = () => setIsOpen(true);
    const closeDetalhes = () => setIsOpen(false);

    return (
        <>
            <div className="px-4 py-6 max-w-[400px] rounded-2xl border-2 border-orange-200 bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800">{title}</p>
                    <p className="px-3 py-1 text-xs text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-full font-semibold">
                        {stats}
                    </p>
                </div>
                
                <div className="mt-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>

                <div className="mt-4">
                    <div className="flex gap-2 items-center text-gray-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                        <CalendarClock size={18} className="text-orange-600" />
                        <p className="text-sm font-medium">{startDate} - {endDate}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <p className={`px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${visibility === "PUBLIC" ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600"}`}>
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
                id={id}
                isOpen={isOpen}
                onClose={closeDetalhes}
                title={title}
                stats={stats}
                description={description}
                startDate={startDate}
                endDate={endDate}
                theme={theme}
                visibility={visibility}
            />
        </>
    );
}