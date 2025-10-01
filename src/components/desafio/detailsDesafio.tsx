import { Modal } from "@/components/ui/modal";
import Ideias from "./ideias";

type Props = {
    title:string,
    stats:string,
    description:string,
    dateInicial:string,
    datefinal:string,
    tipo:'publico' | 'privado',
    isOpen: boolean;
    onClose: () => void;
};

export default function DetalhesDesafio({ isOpen, onClose, title, stats, description, dateInicial, datefinal, tipo }: Props) {
    const ideias = [
        {
            username: "User1",
            userImage: "../images//user/user-01.jpg",
            ideia: "Melhorar a documentação",
            date: "2023-03-15",
            likes: 10,
            isLiked: false
        },
        {
            username: "User2",
            userImage: "../images//user/user-02.jpg",
            ideia: "Adicionar mais exemplos",
            date: "2023-03-16",
            likes: 5,
            isLiked: true
        }
    ]
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 min-w-[320px] ">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
                <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Status:</span>
                    <span className={`px-2 py-1 rounded text-white text-xs ${stats === 'ativo' ? 'bg-blue-600' : 'bg-gray-400'}`}>{stats}</span>
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Descrição:</span>
                    <p className="ml-2 text-gray-800 dark:text-gray-100">{description}</p>
                </div>
                <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Data:</span>
                    <span className="text-gray-800 dark:text-gray-100">{dateInicial} - {datefinal}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Tipo:</span>
                    <span className={`px-2 py-1 rounded text-white text-xs ${tipo === 'publico' ? 'bg-blue-600' : 'bg-orange-600'}`}>{tipo}</span>
                </div>
            </div>
            <Ideias ideias={ideias} />
            
        </Modal>
    );
}