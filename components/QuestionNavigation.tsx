/**
 * QuestionNavigation Component
 * Displays a grid of question numbers with status indicators
 * Allows users to navigate to specific questions
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  Visibility,
  QuestionMark,
} from '@mui/icons-material';
import { ProcessedQuestion } from '../types/quiz';

// Interface for component props
interface QuestionNavigationProps {
  questions: ProcessedQuestion[];
  currentQuestionIndex: number;
  onQuestionSelect: (questionIndex: number) => void;
  isReviewMode?: boolean;
}

/**
 * QuestionNavigation component - Shows question grid with status indicators
 * @param questions - Array of all quiz questions
 * @param currentQuestionIndex - Currently active question index
 * @param onQuestionSelect - Callback to navigate to a specific question
 * @param isReviewMode - Whether the quiz is in review mode
 */
export default function QuestionNavigation({
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  isReviewMode = false,
}: QuestionNavigationProps) {
  /**
   * Gets the status of a question for display
   * @param question - The question object
   * @param index - Question index
   * @returns Status object with icon, color, and label
   */
  const getQuestionStatus = (question: ProcessedQuestion, index: number) => {
    // Current question
    if (index === currentQuestionIndex) {
      return {
        icon: <QuestionMark />,
        color: 'primary' as const,
        label: 'Current Question',
        bgColor: '#3b82f6',
        textColor: 'white',
      };
    }

    // Answered questions
    if (question.is_answered) {
      return {
        icon: <CheckCircle />,
        color: 'success' as const,
        label: 'Answered',
        bgColor: '#22c55e',
        textColor: 'white',
      };
    }

    // Visited but not answered
    if (question.is_visited) {
      return {
        icon: <Visibility />,
        color: 'info' as const,
        label: 'Visited',
        bgColor: '#3b82f6',
        textColor: 'white',
      };
    }

    // Not visited
    return {
      icon: <RadioButtonUnchecked />,
      color: 'default' as const,
      label: 'Not Visited',
      bgColor: '#e5e7eb',
      textColor: '#6b7280',
    };
  };

  /**
   * Handles question selection
   * @param index - Question index to navigate to
   */
  const handleQuestionClick = (index: number) => {
    onQuestionSelect(index);
  };

  return (
    <Paper elevation={3} className="p-4 mb-6">
      {/* Header */}
      <Box className="mb-4">
        <Typography variant="h6" className="font-semibold mb-2">
          Question Navigation
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Click on any question number to navigate. Green = answered, Blue = visited, Gray = not visited.
        </Typography>
      </Box>

      {/* Question Grid */}
      <Grid container spacing={2}>
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const isClickable = !isReviewMode || question.is_visited;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <Tooltip 
                title={`${status.label} - Question ${index + 1}`}
                placement="top"
              >
                <Box
                  className={`
                    relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isClickable ? 'hover:shadow-md hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                  `}
                  sx={{
                    backgroundColor: status.bgColor,
                    borderColor: status.bgColor,
                    color: status.textColor,
                    '&:hover': isClickable ? {
                      backgroundColor: status.bgColor,
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                    } : {},
                  }}
                  onClick={() => isClickable && handleQuestionClick(index)}
                >
                  {/* Question Number */}
                  <Typography 
                    variant="h6" 
                    className="font-bold text-center"
                    sx={{ color: status.textColor }}
                  >
                    {index + 1}
                  </Typography>

                  {/* Status Icon */}
                  <Box className="flex justify-center mt-1">
                    {React.cloneElement(status.icon, {
                      sx: { 
                        fontSize: '1.2rem',
                        color: status.textColor,
                      }
                    })}
                  </Box>

                  {/* Current Question Indicator */}
                  {index === currentQuestionIndex && (
                    <Box className="absolute -top-1 -right-1">
                      <Chip
                        label="Current"
                        size="small"
                        color="primary"
                        sx={{
                          fontSize: '0.7rem',
                          height: '20px',
                          '& .MuiChip-label': {
                            padding: '0 6px',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      {/* Legend */}
      <Box className="mt-6 pt-4 border-t border-gray-200">
        <Typography variant="subtitle2" className="font-semibold mb-2">
          Legend:
        </Typography>
        <Box className="flex flex-wrap gap-3">
          <Box className="flex items-center space-x-1">
            <CheckCircle className="text-green-600" fontSize="small" />
            <Typography variant="caption">Answered</Typography>
          </Box>
          <Box className="flex items-center space-x-1">
            <Visibility className="text-blue-600" fontSize="small" />
            <Typography variant="caption">Visited</Typography>
          </Box>
          <Box className="flex items-center space-x-1">
            <RadioButtonUnchecked className="text-gray-400" fontSize="small" />
            <Typography variant="caption">Not Visited</Typography>
          </Box>
          <Box className="flex items-center space-x-1">
            <QuestionMark className="text-blue-600" fontSize="small" />
            <Typography variant="caption">Current</Typography>
          </Box>
        </Box>
      </Box>

      {/* Progress Summary */}
      <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Typography variant="body2" className="font-medium mb-1">
          Progress Summary:
        </Typography>
        <Box className="flex justify-between text-sm text-gray-600">
          <span>Answered: {questions.filter(q => q.is_answered).length}</span>
          <span>Visited: {questions.filter(q => q.is_visited).length}</span>
          <span>Remaining: {questions.filter(q => !q.is_visited).length}</span>
        </Box>
      </Box>
    </Paper>
  );
} 