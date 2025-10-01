import { FaHeart } from "react-icons/fa";
import { MessageSquareText } from 'lucide-react'


type Props = {
    username: string;
    userImage: string;
    ideia: string;
    date: string;
    likes: number;
    isLiked: boolean;
    commentsCount?: number; // opcional, caso queira passar a quantidade de comentários
}

export default function Ideia({ username, userImage, ideia, date, likes, isLiked, commentsCount = 0 }: Props) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-150 dark:border-gray-900">
            <div className="flex items-center mb-2">
                <img src={userImage} alt={username} className="h-10 w-10 rounded-full mr-3 border-2 border-gray-300" />
                <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{username}</p>
                    <p className="text-gray-700 dark:text-gray-200">{ideia}</p>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 transition-colors">
                        <FaHeart color={isLiked ? '#fb6514' : '#d0d5dd'} />
                        <span className="text-sm font-semibold">{likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-orange-600 transition-colors">
                        <MessageSquareText size={18} />
                        <span className="text-sm">{commentsCount}</span>
                        <span className="ml-1 text-xs">Ver comentários</span>
                    </button>
                </div>
            </div>
        </div>
    )
}