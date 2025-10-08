import Comment from './comment';
import { CommentType } from '@/types/comment';

type Props = {
    comments: CommentType[];
}

export default function CommentList({ comments }: Props) {
    return (
        <div className='p-6'>
            {comments.map((comment, index) => (
                <Comment
                    key={index}
                    comment={comment}
                />
            ))}
        </div>
    );
}
