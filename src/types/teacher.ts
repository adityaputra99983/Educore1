export interface ScheduleItem {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  class: string;
  room: string;
  description?: string; // Optional description field for what is being taught
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  photo: string;
  schedule: ScheduleItem[];
}