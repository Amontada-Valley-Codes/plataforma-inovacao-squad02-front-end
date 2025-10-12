import Ideia from "./Ideia";
import { IdeiaType } from "@/types/ideia";

type Props = {
    ideias: IdeiaType[];
}

export default function Ideias({ ideias }: Props) {
    return (
        <div className="p-6 rounded-xl  shadow-lg border border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-bold mb-2">Ideias</h1>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
                Aqui você pode compartilhar suas ideias para novos desafios ou melhorias nos desafios existentes.<br />
                <span className="font-medium">Sua contribuição é muito importante para nós!</span>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">Compartilhar Ideia</button>
            </p>
            <div className="space-y-4">
                {ideias.map((ideia, index) => (
                    <Ideia
                        key={index}
                        Ideia={ideia}
                    />
                ))}
            </div>
        </div>
    );
}