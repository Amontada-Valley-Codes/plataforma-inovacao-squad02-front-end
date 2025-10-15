export type ChallengeType = {
    id: string;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
    theme: string;
    description: string;
    funnelStage: string;
    visibility: 'PUBLIC' | 'INTERNAL';
};