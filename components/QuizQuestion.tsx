/**
 * QuizQuestion Component
 * Displays individual quiz questions with multiple choice options
 * Handles user answer selection and question navigation
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import {
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Cancel,
  Help,
} from '@mui/icons-material';
import { ProcessedQuestion } from '../types/quiz';

// Interface for component props
interface QuizQuestionProps {
  question: ProcessedQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswerSelect: (questionId: number, answer: string) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onFinishQuiz: () => void;
  isReviewMode?: boolean;
}

/**
 * QuizQuestion component - Displays a single question with options
 * @param question - The question object to display
 * @param questionIndex - Current question index (0-based)
 * @param totalQuestions - Total number of questions
 * @param onAnswerSelect - Callback when user selects an answer
 * @param onNextQuestion - Callback to go to next question
 * @param onPreviousQuestion - Callback to go to previous question
 * @param onFinishQuiz - Callback to finish the quiz
 * @param isReviewMode - Whether in review mode
 */
export default function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onFinishQuiz,
  isReviewMode = false,
}: QuizQuestionProps) {
  // Ref for scrolling to question
  const questionRef = useRef<HTMLDivElement>(null);

  // State for selected answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    question.user_answer
  );

  // State for showing correct answer in review mode
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // Update selected answer when question changes and scroll to top
  useEffect(() => {
    setSelectedAnswer(question.user_answer);
    setShowCorrectAnswer(false);
    
    // Scroll to the top of the question smoothly
    if (questionRef.current) {
      questionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [question.id]);

  /**
   * Handles answer selection
   * @param answer - Selected answer
   */
  const handleAnswerSelect = (answer: string) => {
    if (isReviewMode) {
      setSelectedAnswer(answer);
      setShowCorrectAnswer(true);
    } else {
      setSelectedAnswer(answer);
      onAnswerSelect(question.id, answer);
    }
  };

  /**
   * Handles navigation to next question
   */
  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      onNextQuestion();
    } else {
      onFinishQuiz();
    }
  };

  /**
   * Gets the status of an option for display
   * @param option - The option text
   * @returns Status object with styling information
   */
  const getOptionStatus = (option: string) => {
    if (!isReviewMode) {
      return {
        isSelected: selectedAnswer === option,
        isCorrect: false,
        isIncorrect: false,
      };
    }

    const isSelected = selectedAnswer === option;
    const isCorrect = option === question.correct_answer;
    const isIncorrect = isSelected && option !== question.correct_answer;

    return {
      isSelected,
      isCorrect,
      isIncorrect,
    };
  };

  /**
   * Gets the icon for an option
   * @param option - The option text
   * @returns Icon component or null
   */
  const getOptionIcon = (option: string) => {
    if (!isReviewMode) {
      return selectedAnswer === option ? <CheckCircle /> : null;
    }

    if (option === question.correct_answer) {
      return <CheckCircle className="text-green-600" />;
    }
    if (selectedAnswer === option && option !== question.correct_answer) {
      return <Cancel className="text-red-600" />;
    }
    return null;
  };

  return (
    <Box ref={questionRef} className="max-w-4xl mx-auto p-4">
      {/* Question Header */}
      <Box className="mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h5" className="font-semibold text-gray-800">
            Question {questionIndex + 1} of {totalQuestions}
          </Typography>
          <Chip
            label={question.difficulty}
            color={
              question.difficulty === 'easy' ? 'success' :
              question.difficulty === 'medium' ? 'warning' : 'error'
            }
            size="small"
          />
        </Box>
        
        <Chip
          label={question.category}
          variant="outlined"
          size="small"
          className="mb-2"
        />
      </Box>

      {/* Question Card */}
      <Card elevation={3} className="mb-6">
        <CardContent className="p-6">
          <Typography 
            variant="h6" 
            className="font-medium mb-6 text-gray-800 leading-relaxed"
            sx={{ lineHeight: 1.6 }}
          >
            {question.question}
          </Typography>

          {/* Answer Options */}
          <RadioGroup
            value={selectedAnswer || ''}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {question.options.map((option, index) => {
              const status = getOptionStatus(option);
              const optionIcon = getOptionIcon(option);

              return (
                <Paper
                  key={index}
                  elevation={1}
                  className={`
                    mb-3 transition-all duration-200 cursor-pointer
                    ${status.isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
                    ${status.isCorrect ? 'bg-green-50 border-green-200' : ''}
                    ${status.isIncorrect ? 'bg-red-50 border-red-200' : ''}
                  `}
                  sx={{
                    border: status.isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <FormControlLabel
                    value={option}
                    control={<Radio />}
                    label={
                      <Box className="flex items-center justify-between w-full">
                        <Typography 
                          variant="body1" 
                          className="flex-1"
                          sx={{
                            color: status.isCorrect ? '#16a34a' : 
                                   status.isIncorrect ? '#dc2626' : 'inherit',
                            fontWeight: status.isSelected ? 600 : 400,
                          }}
                        >
                          {option}
                        </Typography>
                        {optionIcon && (
                          <Box className="ml-2">
                            {optionIcon}
                          </Box>
                        )}
                      </Box>
                    }
                    className="w-full p-3 m-0"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      },
                    }}
                  />
                </Paper>
              );
            })}
          </RadioGroup>

          {/* Review Mode Instructions */}
          {isReviewMode && (
            <Alert severity="info" className="mt-4">
              <Typography variant="body2">
                <strong>Review Mode:</strong> You can change your answers to see the correct responses.
                Green checkmarks indicate correct answers, red X marks show incorrect selections.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box className="flex justify-between items-center">
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={onPreviousQuestion}
          disabled={questionIndex === 0}
          className="px-6"
        >
          Previous
        </Button>

        <Box className="flex items-center space-x-2">
          {isReviewMode && (
            <Button
              variant="outlined"
              startIcon={<Help />}
              onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
              className="px-4"
            >
              {showCorrectAnswer ? 'Hide' : 'Show'} Answer
            </Button>
          )}
        </Box>

        <Button
          variant="contained"
          endIcon={questionIndex === totalQuestions - 1 ? null : <NavigateNext />}
          onClick={handleNext}
          disabled={!selectedAnswer && !isReviewMode}
          className="px-6"
          color={questionIndex === totalQuestions - 1 ? 'success' : 'primary'}
        >
          {questionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
        </Button>
      </Box>

      {/* Correct Answer Display (Review Mode) */}
      {isReviewMode && showCorrectAnswer && (
        <Alert severity="success" className="mt-4">
          <Typography variant="body1" className="font-semibold">
            Correct Answer: {question.correct_answer}
          </Typography>
          {selectedAnswer && selectedAnswer !== question.correct_answer && (
            <Typography variant="body2" className="mt-1">
              Your answer: {selectedAnswer}
            </Typography>
          )}
        </Alert>
      )}
    </Box>
  );
} 