// Data types for Life Timeline App

export interface Activity {
  id: number;
  name: string;
  description: string;
  displayType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color: string;
  backgroundColor: string;
  position: { x: number; y: number };
  createdAt: string;
}

export interface Achievement {
  id: number;
  title: string;
  year: number;
  category: string;
  icon: string;
}

export interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  category: string;
  icon: string;
}

export interface FriendMessage {
  id: number;
  message: string;
  fromName: string;
  fromAvatar: string;
  position: { x: number; y: number };
  createdAt: string;
}

export interface Friend {
  id: number;
  name: string;
  birthDate: string;
  color: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoCollection {
  today: Todo[];
  tomorrow: Todo[];
  upcoming: Todo[];
  monthly: Todo[];
}

export interface EmotionData {
  date: string;
  emotion: string;
  timestamp: number;
}

export interface UserProfile {
  birthDate: string;
  maxAge: number;
}

// Import/Export interfaces
export interface AppData {
  userProfile: UserProfile;
  activities: Activity[];
  achievements: Achievement[];
  goals: Goal[];
  friends: Friend[];
  friendMessages: FriendMessage[];
  todos: TodoCollection;
  todayEmotion: EmotionData | null;
  exportDate: string;
  version: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data?: AppData;
  errors?: string[];
}

export interface ExportOptions {
  includeActivities: boolean;
  includeAchievements: boolean;
  includeGoals: boolean;
  includeFriends: boolean;
  includeFriendMessages: boolean;
  includeTodos: boolean;
  includeEmotions: boolean;
  includeUserProfile: boolean;
}

export type ImportFileType = 'json' | 'csv';
export type ExportFileType = 'json' | 'csv';