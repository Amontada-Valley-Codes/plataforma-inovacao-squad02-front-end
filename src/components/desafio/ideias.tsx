import Ideia from "./ideia";

type Props = {
    ideias: {
        username: string;
        userImage: string;
        ideia: string;
        date: string;
        likes: number;
        isLiked: boolean;
    }[];
}

export default function Ideias({ ideias }: Props) {
    return (
        <div className="p-6 rounded-xl  shadow-lg border border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-bold mb-2">Ideias</h1>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
                Aqui você pode compartilhar suas ideias para novos desafios ou melhorias nos desafios existentes.<br />
                <span className="font-medium">Sua contribuição é muito importante para nós!</span>
            </p>
            <div className="space-y-4">
                {ideias.map((ideia, index) => (
                    <Ideia
                        key={index}
                        username={ideia.username}
                        userImage={ideia.userImage}
                        ideia={ideia.ideia}
                        date={ideia.date}
                        likes={ideia.likes}
                        isLiked={ideia.isLiked}
                    />
                ))}
            </div>
        </div>
    );
}