// User related types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  name: string;
  createdAt: Date;
}

// Course related types
export interface Course {
  id: string;
  name: string;
  instructorId: string;
  students: string[];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'upcoming';
}

// Announcement related types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
}

// Task related types
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Analytics related types
export interface AnalyticsData {
  studentCount: number;
  courseCount: number;
  completionRate: number;
  activeStudents: number;
}

// Chat related types
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// License related types
export type LicenseClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type DifferenceClass = 'A1' | 'A2' | 'B1' | 'C1' | 'D1' | 'E1' | 'F1';

export const CLASS_NAMES: Record<LicenseClass | DifferenceClass, string> = {
  'A': 'Motosiklet',
  'A1': 'Hafif Motosiklet',
  'A2': 'Orta Motosiklet',
  'B': 'Otomobil ve Kamyonet',
  'B1': 'Dört Tekerlekli Motosiklet',
  'C': 'Kamyon',
  'C1': 'Küçük Kamyon',
  'D': 'Minibüs ve Otobüs',
  'D1': 'Minibüs',
  'E': 'Römorklu Araçlar',
  'E1': 'Hafif Römorklu Araçlar',
  'F': 'Traktör',
  'F1': 'Özel Amaçlı Taşıtlar'
};
