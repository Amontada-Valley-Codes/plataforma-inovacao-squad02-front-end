import { FaHeart } from "react-icons/fa";

type Props = {
    username: string;
    userImage: string;
    comment: string;
    date: string;
    likes: number;
    isLiked: boolean;

}

export default function Comment({ username, userImage, comment, date, likes, isLiked }: Props) {
    return (
        <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border mb-2">
            <img
                src={userImage}
                alt={username}
                className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
                    <span className="text-xs text-gray-400">{date}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 mb-2">{comment}</p>
                <div className="flex items-center gap-2 text-sm">
                    <span className="cursor-pointer">
                        <FaHeart color={isLiked ? "red" : "gray"} />
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{likes} curtidas</span>
                </div>
            </div>
        </div>
    );
}