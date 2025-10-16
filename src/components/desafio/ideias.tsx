import Ideia from "./ideia";
import { IdeiaType } from "@/types/ideia";
import FormIdea from "./FormIdea";
import { useState } from "react";

type Props = {
    ideias: IdeiaType[];
    challengeId: string;
    funnelStage: string;
}

export default function Ideias({ ideias, challengeId, funnelStage }: Props) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h1 className={`${funnelStage === 'IDEATION' || funnelStage === 'DETAILED_SCREENING' || funnelStage === 'EXPERIMENTATION'? 'text-2xl font-bold mb-2' : 'hidden'}`}>Ideias</h1>
            <p className={`${funnelStage === 'IDEATION'? 'mb-6 text-gray-700 dark:text-gray-300' : 'hidden'}`}>
                Aqui você pode compartilhar suas ideias para novos desafios ou melhorias nos desafios existentes.<br />
                <button 
                    className={` ${funnelStage === 'IDEATION'? 'mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-700  transition-colors text-white font-semibold rounded-lg shadow' : 'hidden'}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Fechar Formulário" : "Compartilhar Ideia"}
                </button>
            </p>

            {showForm && (
                <div className="mb-6">
                    <FormIdea 
                    challengeId={challengeId}
                    handleAddCommentClickIdea={() => setShowForm(!showForm)}
                    />
                </div>
            )}

            <div className="space-y-4">
                {ideias.map((ideia, index) => (
                    <Ideia
                        key={index}
                        Ideia={ideia}
                        funnelStage={funnelStage}
                    />
                ))}
            </div>
        </div>
    );
}