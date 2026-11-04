export type NavigationPage = 
  | 'landing'
  | 'dashboard'
  | 'companion'
  | 'planner'
  | 'journal'
  | 'study'
  | 'motivation'
  | 'profile'
  | 'game'
  | 'music';

export type MoodType = 'radiant' | 'content' | 'neutral' | 'overwhelmed' | 'exhausted';

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  mood: MoodType;
  intensity: number; // 1-10
  tags: string[];
  note: string;
  promptQuestion?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  tone?: 'comfort' | 'clarity' | 'action' | 'listening';
}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
  messages: ChatMessage[];
}

export interface ChecklistTask {
  id: string;
  title: string;
  category: 'grounding' | 'study' | 'selfcare' | 'winddown';
  energyLevel: 'low' | 'medium' | 'high';
  completed: boolean;
  estimatedMinutes: number;
}

export interface ComebackGoal {
  id: string;
  title: string;
  challengeType: string;
  targetDate: string;
  progressPercent: number;
  emotionalFocus: string;
  tasks: ChecklistTask[];
}

export interface TopicItem {
  id: string;
  name: string;
  status: 'needs_review' | 'in_progress' | 'mastered';
}

export interface SubjectRecovery {
  id: string;
  name: string;
  code: string;
  color: string;
  examDate: string;
  targetScoreGrade: string;
  topics: TopicItem[];
}

export interface AffirmationCard {
  id: string;
  text: string;
  category: 'burnout' | 'failure' | 'comparison' | 'anxiety' | 'growth';
  author?: string;
  bookmarked?: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

export interface StudentProfile {
  name: string;
  gradeLevel: 'High School' | 'College Freshman' | 'Undergraduate' | 'Graduate Student' | 'Self-Learner';
  avatarId: string;
  dailyStreak: number;
  themePreference: 'lavender' | 'warm_cream' | 'dark';
  enableAmbientSounds: boolean;
  dailyGoalHours: number;
}
