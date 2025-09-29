
type Props = {
    comments: {
        username: string;
        userImage: string;
        comment: string;
        date: string;
        likes: number;
        isLiked: boolean;
    }[];
}

export default function CommentList({ comments }: Props) {
    return (
        <div>
        </div>
    );
}
