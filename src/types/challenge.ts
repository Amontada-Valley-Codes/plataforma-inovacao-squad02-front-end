export type ChallengeType = {
    id: string;
    title: string;
    stats: string;
    startDate: string;
    endDate: string;
    theme: string;
    description: string;
    visibility: 'PUBLIC' | 'INTERNAL';
};