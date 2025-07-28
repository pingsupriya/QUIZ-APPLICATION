/**
 * Type definitions for the Quiz Application
 * These interfaces define the structure of quiz data and user responses
 */

// Interface for a single quiz question from the API
export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// Interface for the API response
export interface QuizApiResponse {
  response_code: number;
  results: QuizQuestion[];
}

// Interface for a processed question with shuffled options
export interface ProcessedQuestion {
  id: number;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  options: string[]; // Shuffled array of correct + incorrect answers
  user_answer?: string; // User's selected answer
  is_answered: boolean;
  is_visited: boolean;
}

// Interface for user quiz session data
export interface QuizSession {
  user_email: string;
  start_time: Date;
  end_time?: Date;
  questions: ProcessedQuestion[];
  current_question_index: number;
  time_remaining: number; // in seconds
  is_completed: boolean;
  score?: number;
  total_questions: number;
}

// Interface for quiz results
export interface QuizResults {
  user_email: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_questions: number;
  time_taken: number; // in seconds
  completion_date: Date;
  question_results: QuestionResult[];
}

// Interface for individual question result
export interface QuestionResult {
  question_id: number;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  category: string;
  difficulty: string;
}

// Interface for navigation state
export interface NavigationState {
  current_question: number;
  visited_questions: Set<number>;
  answered_questions: Set<number>;
}

// Interface for timer state
export interface TimerState {
  time_remaining: number; // in seconds
  is_running: boolean;
  is_paused: boolean;
}

// Interface for quiz settings
export interface QuizSettings {
  total_questions: number;
  time_limit: number; // in minutes
  allow_navigation: boolean;
  show_progress: boolean;
  auto_submit: boolean;
}

// Interface for component props
export interface QuizComponentProps {
  session: QuizSession;
  onAnswerSelect: (questionId: number, answer: string) => void;
  onQuestionNavigate: (questionIndex: number) => void;
  onQuizComplete: (results: QuizResults) => void;
}

// Interface for email validation
export interface EmailValidation {
  isValid: boolean;
  message: string;
}

// Interface for API error handling
export interface ApiError {
  message: string;
  code: number;
  details?: any;
}

// Interface for loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
}

// Interface for quiz statistics
export interface QuizStats {
  total_quizzes_taken: number;
  average_score: number;
  best_score: number;
  total_time_spent: number; // in minutes
  favorite_category?: string;
  improvement_trend: number; // percentage improvement over time
} 