export type Subject = 'Math' | 'Science' | 'History' | 'Coding' | 'Other';

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: Subject;
  color: string;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  createdAt: number;
}

export interface StudySession {
  id: string;
  duration: number; // in minutes
  type: 'focus' | 'short-break' | 'long-break';
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  streak: number;
  totalStudyTime: number; // in minutes
  lastStudyDate?: string; // YYYY-MM-DD
}
