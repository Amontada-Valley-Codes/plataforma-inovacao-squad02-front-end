import Comment from './comment';

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
        <div className='p-6'>
            {comments.map((c, index) => (
                <Comment
                    key={index}
                    username={c.username}
                    userImage={c.userImage}
                    comment={c.comment}
                    date={c.date}
                    likes={c.likes}
                    isLiked={c.isLiked}
                />
            ))}
        </div>
    );
}
