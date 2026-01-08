export type JourneyStatus = 'not-started' | 'active' | 'paused';

export interface Journey {
  status: JourneyStatus;
  startDate: string | null; // YYYY-MM-DD format, Monday's date
  pausedAt?: string; // ISO string when journey was paused
  resumedAt?: string; // ISO string when journey was resumed
}
