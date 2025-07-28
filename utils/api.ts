/**
 * API utility functions for fetching quiz questions
 * Handles communication with the Open Trivia Database API
 */

import { QuizApiResponse, QuizQuestion, ProcessedQuestion, ApiError } from '../types/quiz';

// Base URL for our server-side API route
const API_BASE_URL = '/api/quiz';

/**
 * Fetches quiz questions from the Open Trivia Database API
 * @param amount - Number of questions to fetch (default: 15)
 * @param category - Optional category filter
 * @param difficulty - Optional difficulty filter
 * @returns Promise with processed quiz questions
 */
export async function fetchQuizQuestions(
  amount: number = 15,
  category?: number,
  difficulty?: string
): Promise<ProcessedQuestion[]> {
  try {
    // Build the API URL with query parameters
    const params = new URLSearchParams({
      amount: amount.toString(),
      type: 'multiple', // Multiple choice questions only
    });

    // Add optional parameters if provided
    if (category) {
      params.append('category', category.toString());
    }
    if (difficulty) {
      params.append('difficulty', difficulty);
    }

    const url = `${API_BASE_URL}?${params.toString()}`;
    
    console.log('Fetching quiz questions from:', url);

    // Fetch data from our server-side API route
    const response = await fetch(url, {
      method: 'GET',
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data: QuizApiResponse = await response.json();

    // Check if the API returned an error
    if (data.response_code !== 0) {
      throw new Error(`API error! response_code: ${data.response_code}`);
    }

    // Process and return the questions
    return processQuizQuestions(data.results);

  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    
    // Create a more detailed error object
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: error instanceof Error && 'status' in error ? (error as any).status : 500,
      details: error,
    };

    throw apiError;
  }
}

/**
 * Processes raw quiz questions from the API
 * Converts HTML entities, shuffles options, and adds metadata
 * @param questions - Raw questions from the API
 * @returns Processed questions ready for the quiz
 */
export function processQuizQuestions(questions: QuizQuestion[]): ProcessedQuestion[] {
  return questions.map((question, index) => {
    // Decode HTML entities in question and answers
    const decodedQuestion = decodeHtmlEntities(question.question);
    const decodedCorrectAnswer = decodeHtmlEntities(question.correct_answer);
    const decodedIncorrectAnswers = question.incorrect_answers.map(decodeHtmlEntities);

    // Create options array with correct and incorrect answers
    const options = [decodedCorrectAnswer, ...decodedIncorrectAnswers];

    // Shuffle the options to randomize their order
    const shuffledOptions = shuffleArray(options);

    return {
      id: index + 1,
      category: decodeHtmlEntities(question.category),
      type: question.type,
      difficulty: question.difficulty,
      question: decodedQuestion,
      correct_answer: decodedCorrectAnswer,
      options: shuffledOptions,
      user_answer: undefined,
      is_answered: false,
      is_visited: false,
    };
  });
}

/**
 * Decodes HTML entities in text
 * Handles common HTML entities like &amp;, &quot;, &lt;, &gt;, etc.
 * @param text - Text containing HTML entities
 * @returns Decoded text
 */
function decodeHtmlEntities(text: string): string {
  // Use a simple regex-based approach that works on both server and client
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * Ensures random order of options for each question
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid mutating the original
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  
  return shuffled;
}

/**
 * Validates email format using regex
 * @param email - Email address to validate
 * @returns True if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculates quiz score based on correct answers
 * @param questions - Array of processed questions
 * @returns Score as a percentage
 */
export function calculateScore(questions: ProcessedQuestion[]): number {
  const answeredQuestions = questions.filter(q => q.is_answered);
  const correctAnswers = answeredQuestions.filter(q => q.user_answer === q.correct_answer);
  
  if (answeredQuestions.length === 0) return 0;
  
  return Math.round((correctAnswers.length / answeredQuestions.length) * 100);
}

/**
 * Creates quiz results object from session data
 * @param session - Quiz session data
 * @returns Quiz results object
 */
export function createQuizResults(session: any): any {
  const questionResults = session.questions.map((q: ProcessedQuestion) => ({
    question_id: q.id,
    question: q.question,
    user_answer: q.user_answer || 'Not answered',
    correct_answer: q.correct_answer,
    is_correct: q.user_answer === q.correct_answer,
    category: q.category,
    difficulty: q.difficulty,
  }));

  const correctAnswers = questionResults.filter((r: any) => r.is_correct).length;
  const incorrectAnswers = questionResults.filter((r: any) => !r.is_correct && r.user_answer !== 'Not answered').length;
  const unansweredQuestions = questionResults.filter((r: any) => r.user_answer === 'Not answered').length;

  return {
    user_email: session.user_email,
    score: calculateScore(session.questions),
    total_questions: session.total_questions,
    correct_answers: correctAnswers,
    incorrect_answers: incorrectAnswers,
    unanswered_questions: unansweredQuestions,
    time_taken: session.time_remaining ? (30 * 60 - session.time_remaining) : 0, // Assuming 30 minutes
    completion_date: new Date(),
    question_results: questionResults,
  };
} 