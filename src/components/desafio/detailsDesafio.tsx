import { Modal } from "@/components/ui/modal";

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
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 min-w-[320px] max-w-[400px]">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
                <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Status:</span>
                    <span className={`px-2 py-1 rounded text-white text-xs ${stats === 'ativo' ? 'bg-green-600' : 'bg-gray-400'}`}>{stats}</span>
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
                    <span className={`px-2 py-1 rounded text-white text-xs ${tipo === 'publico' ? 'bg-blue-600' : 'bg-purple-600'}`}>{tipo}</span>
                </div>
            </div>
        </Modal>
    );
}