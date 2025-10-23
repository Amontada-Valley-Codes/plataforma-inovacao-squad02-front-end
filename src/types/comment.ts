export type CommentType = {
    id: string;
    ideaId: string;
    userId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        companyId: string;
        name: string;
        email: string;
        role: string;
        // avatarUrl?: string; // adicione se houver imagem
    };
};