import { CommentType } from "@/types/comment";

type Props = {
    comment: CommentType;
}

export default function Comment({ comment }: Props) {
    return (
        <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border mb-2">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">{comment.createdAt.toLocaleString()}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 mb-2">{comment.text}</p>
            </div>
        </div>
    );
}