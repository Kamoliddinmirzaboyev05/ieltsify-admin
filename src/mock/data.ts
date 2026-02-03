import type { ListeningMaterial, WritingMaterial, ReadingMaterial, SpeakingMaterial, User } from '../types';

export const mockListening: ListeningMaterial[] = [
  {
    id: '1',
    title: 'University Life Conversation',
    description: 'A conversation between two students about university accommodation.',
    audioFileName: 'uni_life_01.mp3',
    difficulty: 'Easy',
    questions: [
      { id: 'q1', text: 'Where does the male student live?', options: ['Dormitory', 'Flat', 'Shared House'], correctAnswer: 'Dormitory' }
    ]
  },
  {
    id: '2',
    title: 'Environment Lecture',
    description: 'A lecture about climate change and its impact on biodiversity.',
    audioFileName: 'climate_lecture.mp3',
    difficulty: 'Hard',
    questions: []
  }
];

export const mockWriting: WritingMaterial[] = [
  {
    id: '1',
    taskType: 'Task 1',
    prompt: 'The chart below shows the population growth in three cities.',
    imageFileName: 'population_chart.png',
    difficulty: 'Medium'
  },
  {
    id: '2',
    taskType: 'Task 2',
    prompt: 'Some people think that technology has made our lives more complex.',
    difficulty: 'Hard'
  }
];

export const mockReading: ReadingMaterial[] = [
  {
    id: '1',
    title: 'The History of Tea',
    passage: 'Tea is one of the most popular beverages in the world...',
    difficulty: 'Medium',
    questions: []
  }
];

export const mockSpeaking: SpeakingMaterial[] = [
  {
    id: '1',
    topic: 'Your Hometown',
    part1Questions: ['Where are you from?', 'What do you like about your hometown?'],
    part2Questions: ['Describe a place you like to visit in your hometown.'],
    part3Questions: ['How has your hometown changed over the years?']
  }
];

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Student' }
];
