/**
 * Main Quiz Application Page
 * Orchestrates the entire quiz flow with state management
 * Handles routing between different quiz stages
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import StartPage from '../components/StartPage';
import Timer from '../components/Timer';
import QuestionNavigation from '../components/QuestionNavigation';
import QuizQuestion from '../components/QuizQuestion';
import QuizResults from '../components/QuizResults';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  fetchQuizQuestions, 
  createQuizResults,
  calculateScore 
} from '../utils/api';
import { 
  QuizSession, 
  ProcessedQuestion, 
  QuizResults as QuizResultsType,
  LoadingState 
} from '../types/quiz';

// Quiz application states
type QuizState = 'start' | 'loading' | 'quiz' | 'results';

// Main quiz application component
function QuizAppContent() {
  // Application state
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: undefined,
    progress: 0,
  });

  // Quiz session data
  const [session, setSession] = useState<QuizSession | null>(null);
  const [results, setResults] = useState<QuizResultsType | null>(null);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Constants
  const TOTAL_QUESTIONS = 15;
  const TOTAL_TIME = 30 * 60; // 30 minutes in seconds

  /**
   * Starts the quiz with user email
   * @param email - User's email address
   */
  const handleStartQuiz = useCallback(async (email: string) => {
    console.log('Starting quiz with email:', email);
    setQuizState('loading');
    setLoadingState({ isLoading: true, error: undefined, progress: 0 });

    try {
      // Fetch questions from API
      console.log('Fetching questions...');
      setLoadingState(prev => ({ ...prev, progress: 25 }));
      const questions = await fetchQuizQuestions(TOTAL_QUESTIONS);
      console.log('Questions fetched:', questions.length);

      // Process questions and mark first as visited
      setLoadingState(prev => ({ ...prev, progress: 50 }));
      const processedQuestions = questions.map((q, index) => ({
        ...q,
        is_visited: index === 0, // Mark first question as visited
      }));

      // Create quiz session
      setLoadingState(prev => ({ ...prev, progress: 75 }));
      const newSession: QuizSession = {
        user_email: email,
        start_time: new Date(),
        questions: processedQuestions,
        current_question_index: 0,
        time_remaining: TOTAL_TIME,
        is_completed: false,
        total_questions: TOTAL_QUESTIONS,
      };

      console.log('Session created:', newSession);
      setSession(newSession);
      setTimeRemaining(TOTAL_TIME);
      setQuizState('quiz');

      // Start timer
      startTimer();

    } catch (error) {
      console.error('Error starting quiz:', error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load quiz questions',
        progress: 0,
      });
      setQuizState('start');
    }
  }, []);

  /**
   * Starts the countdown timer
   */
  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto-submit quiz
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  }, []);

  /**
   * Stops the timer
   */
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  /**
   * Handles when time runs out
   */
  const handleTimeUp = useCallback(() => {
    stopTimer();
    if (session) {
      // Auto-submit the quiz
      handleFinishQuiz();
    }
  }, [session, stopTimer]);

  /**
   * Handles answer selection for a question
   * @param questionId - ID of the question
   * @param answer - Selected answer
   */
  const handleAnswerSelect = useCallback((questionId: number, answer: string) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;

      const updatedQuestions = prev.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            user_answer: answer,
            is_answered: true,
          };
        }
        return q;
      });

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  }, [session]);

  /**
   * Handles navigation to a specific question
   * @param questionIndex - Index of the question to navigate to
   */
  const handleQuestionNavigate = useCallback((questionIndex: number) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;

      const updatedQuestions = prev.questions.map((q, index) => {
        if (index === questionIndex) {
          return { ...q, is_visited: true };
        }
        return q;
      });

      return {
        ...prev,
        current_question_index: questionIndex,
        questions: updatedQuestions,
      };
    });
  }, [session]);

  /**
   * Handles navigation to next question
   */
  const handleNextQuestion = useCallback(() => {
    if (!session) return;

    const nextIndex = session.current_question_index + 1;
    if (nextIndex < session.questions.length) {
      handleQuestionNavigate(nextIndex);
    }
  }, [session, handleQuestionNavigate]);

  /**
   * Handles navigation to previous question
   */
  const handlePreviousQuestion = useCallback(() => {
    if (!session) return;

    const prevIndex = session.current_question_index - 1;
    if (prevIndex >= 0) {
      handleQuestionNavigate(prevIndex);
    }
  }, [session, handleQuestionNavigate]);

  /**
   * Handles quiz completion
   */
  const handleFinishQuiz = useCallback(() => {
    if (!session) return;

    stopTimer();

    // Create results
    const quizResults = createQuizResults({
      ...session,
      time_remaining: timeRemaining,
      end_time: new Date(),
      is_completed: true,
    });

    setResults(quizResults);
    setQuizState('results');
  }, [session, timeRemaining, stopTimer]);

  /**
   * Handles restarting the quiz
   */
  const handleRestartQuiz = useCallback(() => {
    setSession(null);
    setResults(null);
    setTimeRemaining(TOTAL_TIME);
    setLoadingState({ isLoading: false, error: undefined, progress: 0 });
    setQuizState('start');
  }, []);

  /**
   * Handles going back to home
   */
  const handleGoHome = useCallback(() => {
    setSession(null);
    setResults(null);
    setTimeRemaining(TOTAL_TIME);
    setLoadingState({ isLoading: false, error: undefined, progress: 0 });
    setQuizState('start');
  }, []);

  /**
   * Cleanup timer on component unmount
   */
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Render loading state
  if (quizState === 'loading') {
    return (
      <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
        <Box className="text-center">
          <CircularProgress 
            variant="determinate" 
            value={loadingState.progress} 
            size={80}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Loading Quiz...</h2>
          <p className="text-gray-600 mb-4">
            Fetching questions from Open Trivia Database
          </p>
          {loadingState.error && (
            <Alert severity="error" className="mt-4">
              {loadingState.error}
            </Alert>
          )}
        </Box>
      </Container>
    );
  }

  // Render start page
  if (quizState === 'start') {
    return (
      <StartPage 
        onStartQuiz={handleStartQuiz}
        isLoading={loadingState.isLoading}
      />
    );
  }

  // Render quiz interface
  if (quizState === 'quiz' && session) {
    const currentQuestion = session.questions[session.current_question_index];

    return (
      <Container maxWidth="lg" className="py-6">
        {/* Timer */}
        <Timer
          timeRemaining={timeRemaining}
          totalTime={TOTAL_TIME}
          onTimeUp={handleTimeUp}
        />

        {/* Question Navigation */}
        <QuestionNavigation
          questions={session.questions}
          currentQuestionIndex={session.current_question_index}
          onQuestionSelect={handleQuestionNavigate}
        />

        {/* Current Question */}
        <QuizQuestion
          question={currentQuestion}
          questionIndex={session.current_question_index}
          totalQuestions={session.total_questions}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          onFinishQuiz={handleFinishQuiz}
        />
      </Container>
    );
  }

  // Render results
  if (quizState === 'results' && results) {
    return (
      <QuizResults
        results={results}
        onRestartQuiz={handleRestartQuiz}
        onGoHome={handleGoHome}
      />
    );
  }

  // Fallback error state
  return (
    <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
      <Alert severity="error">
        Something went wrong. Please refresh the page and try again.
      </Alert>
    </Container>
  );
}

// Export the main component wrapped with error boundary
export default function QuizApp() {
  return (
    <ErrorBoundary>
      <QuizAppContent />
    </ErrorBoundary>
  );
} 