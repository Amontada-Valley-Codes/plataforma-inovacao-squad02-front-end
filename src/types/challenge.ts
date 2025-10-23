export type ChallengeType = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: string;
  funnelStage: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  startDate?: string;
  endDate?: string;
  theme?: string;
  visibility?: "PUBLIC" | "INTERNAL";
};