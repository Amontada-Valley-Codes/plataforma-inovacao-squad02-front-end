export type IdeiaType = {
    id: string;
    challengeId: string;
    userId: string;
    companyId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        companyId: string;
        name: string;
        email: string;
        password: string;
        role: string;
        createdAt: string;
        updatedAt: string;
    };
}
type CommentType = {

    userId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
};