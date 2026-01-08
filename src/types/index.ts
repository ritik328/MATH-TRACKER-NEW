export type Topic = {
  id: string;
  title: string;
  completed: boolean;
  plannedDate?: string; // YYYY-MM-DD
  completedAt?: string; // ISO String
};

export type WeekModule = {
  id: number;
  title: string;
  description: string;
  topics: Topic[];
};
