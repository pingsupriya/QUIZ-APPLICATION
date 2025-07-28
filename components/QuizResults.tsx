/**
 * QuizResults Component
 * Displays quiz results with score, detailed breakdown, and answer review
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  Refresh,
  Home,
  Visibility,
  EmojiEvents,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { QuizResults as QuizResultsType, QuestionResult } from '../types/quiz';

// Interface for component props
interface QuizResultsProps {
  results: QuizResultsType;
  onRestartQuiz: () => void;
  onGoHome: () => void;
}

/**
 * QuizResults component - Displays comprehensive quiz results
 * @param results - Quiz results data
 * @param onRestartQuiz - Callback to restart the quiz
 * @param onGoHome - Callback to go back to start page
 */
export default function QuizResults({ results, onRestartQuiz, onGoHome }: QuizResultsProps) {
  // State for expanded review sections
  const [expandedQuestion, setExpandedQuestion] = useState<number | false>(false);

  /**
   * Gets the score color based on performance
   * @param score - Percentage score
   * @returns Color string
   */
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green for excellent
    if (score >= 60) return '#f59e0b'; // Amber for good
    if (score >= 40) return '#f97316'; // Orange for fair
    return '#ef4444'; // Red for poor
  };

  /**
   * Gets the score message based on performance
   * @param score - Percentage score
   * @returns Encouraging message
   */
  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're a quiz master! 🏆";
    if (score >= 80) return "Excellent work! You really know your stuff! 🌟";
    if (score >= 70) return "Great job! You have solid knowledge! 👍";
    if (score >= 60) return "Good effort! Keep learning and improving! 📚";
    if (score >= 50) return "Not bad! There's room for improvement! 💪";
    if (score >= 40) return "Keep practicing! You'll get better! 🔄";
    return "Don't give up! Every attempt is a learning opportunity! 🌱";
  };

  /**
   * Formats time taken in a readable format
   * @param seconds - Time in seconds
   * @returns Formatted time string
   */
  const formatTimeTaken = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  /**
   * Handles accordion expansion
   * @param questionId - Question ID to expand/collapse
   */
  const handleAccordionChange = (questionId: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedQuestion(isExpanded ? questionId : false);
  };

  return (
    <Box className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <Box className="text-center mb-8">
        <EmojiEvents className="text-6xl text-yellow-500 mb-4" />
        <Typography variant="h3" className="font-bold mb-2 text-gradient">
          Quiz Complete!
        </Typography>
        <Typography variant="h6" className="text-gray-600 mb-4">
          Here are your results
        </Typography>
      </Box>

      {/* Score Card */}
      <Card elevation={4} className="mb-8">
        <CardContent className="p-8 text-center">
          <Box className="mb-6">
            <Typography variant="h2" className="font-bold mb-2">
              <span style={{ color: getScoreColor(results.score) }}>
                {results.score}%
              </span>
            </Typography>
            <Typography variant="h5" className="text-gray-600 mb-4">
              {getScoreMessage(results.score)}
            </Typography>
          </Box>

          {/* Score Progress Bar */}
          <Box className="mb-6">
            <LinearProgress
              variant="determinate"
              value={results.score}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${getScoreColor(results.score)} 0%, ${getScoreColor(results.score)}80 100%)`,
                },
              }}
            />
            <Typography variant="body2" className="text-gray-600 mt-2">
              {results.correct_answers} out of {results.total_questions} questions correct
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="p-4 text-center">
            <CheckCircle className="text-green-600 text-3xl mb-2" />
            <Typography variant="h4" className="font-bold text-green-600">
              {results.correct_answers}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Correct Answers
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="p-4 text-center">
            <Cancel className="text-red-600 text-3xl mb-2" />
            <Typography variant="h4" className="font-bold text-red-600">
              {results.incorrect_answers}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Incorrect Answers
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="p-4 text-center">
            <Visibility className="text-blue-600 text-3xl mb-2" />
            <Typography variant="h4" className="font-bold text-blue-600">
              {results.unanswered_questions}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Unanswered
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="p-4 text-center">
            <Schedule className="text-purple-600 text-3xl mb-2" />
            <Typography variant="h4" className="font-bold text-purple-600">
              {formatTimeTaken(results.time_taken)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Time Taken
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Results */}
      <Card elevation={3} className="mb-8">
        <CardContent className="p-6">
          <Typography variant="h5" className="font-semibold mb-4">
            Detailed Results
          </Typography>

          {results.question_results.map((questionResult, index) => (
            <Accordion
              key={questionResult.question_id}
              expanded={expandedQuestion === questionResult.question_id}
              onChange={handleAccordionChange(questionResult.question_id)}
              className="mb-2"
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box className="flex items-center justify-between w-full">
                  <Box className="flex items-center space-x-3">
                    <Chip
                      label={`Q${index + 1}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body1" className="font-medium">
                      {questionResult.question.length > 60
                        ? `${questionResult.question.substring(0, 60)}...`
                        : questionResult.question}
                    </Typography>
                  </Box>
                  <Box className="flex items-center space-x-2">
                    {questionResult.is_correct ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      <Cancel className="text-red-600" />
                    )}
                    <Chip
                      label={questionResult.difficulty}
                      size="small"
                      color={
                        questionResult.difficulty === 'easy' ? 'success' :
                        questionResult.difficulty === 'medium' ? 'warning' : 'error'
                      }
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-3">
                  <Typography variant="body1" className="font-medium">
                    {questionResult.question}
                  </Typography>
                  
                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Paper elevation={1} className="p-3">
                      <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-700">
                        Your Answer:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className={`p-2 rounded ${
                          questionResult.is_correct 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {questionResult.user_answer}
                      </Typography>
                    </Paper>

                    <Paper elevation={1} className="p-3">
                      <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-700">
                        Correct Answer:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className="p-2 rounded bg-green-50 text-green-800 border border-green-200"
                      >
                        {questionResult.correct_answer}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box className="flex items-center space-x-2">
                    <Chip label={questionResult.category} size="small" variant="outlined" />
                    <Typography variant="caption" className="text-gray-500">
                      Completed on {results.completion_date.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box className="flex justify-center space-x-4">
        <Button
          variant="contained"
          size="large"
          startIcon={<Refresh />}
          onClick={onRestartQuiz}
          className="px-8 py-3"
        >
          Take Quiz Again
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Home />}
          onClick={onGoHome}
          className="px-8 py-3"
        >
          Back to Home
        </Button>
      </Box>

      {/* Footer */}
      <Box className="text-center mt-8 pt-6 border-t border-gray-200">
        <Typography variant="body2" className="text-gray-500">
          Quiz completed on {results.completion_date.toLocaleString()}
        </Typography>
        <Typography variant="caption" className="text-gray-400">
          Powered by Open Trivia Database
        </Typography>
      </Box>
    </Box>
  );
} 