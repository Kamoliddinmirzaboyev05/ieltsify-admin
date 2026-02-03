export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface ListeningMaterial {
  id: string;
  title: string;
  description: string;
  audioFileName: string;
  difficulty: Difficulty;
  questions: Question[];
}

export interface ReadingMaterial {
  id: string;
  title: string;
  passage: string;
  difficulty: Difficulty;
  questions: Question[];
}

export interface WritingMaterial {
  id: string;
  taskType: 'Task 1' | 'Task 2';
  prompt: string;
  imageFileName?: string;
  difficulty: Difficulty;
}

export interface SpeakingMaterial {
  id: string;
  topic: string;
  part1Questions: string[];
  part2Questions: string[];
  part3Questions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Student';
}
