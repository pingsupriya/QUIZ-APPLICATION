/**
 * Timer Component
 * Displays a countdown timer for the quiz with visual indicators
 * Shows warnings when time is running low
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Alert,
} from '@mui/material';
import { AccessTime, Warning } from '@mui/icons-material';
import { formatTime } from '../utils/api';

// Interface for component props
interface TimerProps {
  timeRemaining: number; // Time remaining in seconds
  totalTime: number; // Total time in seconds
  onTimeUp: () => void; // Callback when time runs out
}

/**
 * Timer component - Displays countdown timer with visual indicators
 * @param timeRemaining - Current time remaining in seconds
 * @param totalTime - Total time allocated in seconds
 * @param onTimeUp - Callback function when time runs out
 */
export default function Timer({ timeRemaining, totalTime, onTimeUp }: TimerProps) {
  // State for warning display
  const [showWarning, setShowWarning] = useState(false);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);

  // Calculate progress percentage
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  
  // Calculate warning thresholds
  const warningThreshold = totalTime * 0.2; // 20% of total time
  const criticalThreshold = totalTime * 0.1; // 10% of total time

  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= criticalThreshold) {
      return '#ef4444'; // Red for critical
    } else if (timeRemaining <= warningThreshold) {
      return '#f59e0b'; // Amber for warning
    }
    return '#3b82f6'; // Blue for normal
  };

  // Determine progress bar color
  const getProgressColor = () => {
    if (timeRemaining <= criticalThreshold) {
      return 'error';
    } else if (timeRemaining <= warningThreshold) {
      return 'warning';
    }
    return 'primary';
  };

  // Handle time up event
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  // Handle warning states
  useEffect(() => {
    if (timeRemaining <= criticalThreshold && timeRemaining > 0) {
      setShowCriticalWarning(true);
      setShowWarning(false);
    } else if (timeRemaining <= warningThreshold && timeRemaining > criticalThreshold) {
      setShowWarning(true);
      setShowCriticalWarning(false);
    } else {
      setShowWarning(false);
      setShowCriticalWarning(false);
    }
  }, [timeRemaining, warningThreshold, criticalThreshold]);

  return (
    <Box className="w-full mb-6">
      {/* Timer Display */}
      <Paper 
        elevation={3} 
        className="p-4 mb-4"
        sx={{
          background: `linear-gradient(135deg, ${getTimerColor()}15 0%, ${getTimerColor()}25 100%)`,
          border: `2px solid ${getTimerColor()}30`,
        }}
      >
        <Box className="flex items-center justify-between">
          {/* Timer Icon and Label */}
          <Box className="flex items-center space-x-2">
            <AccessTime 
              className="text-2xl"
              sx={{ color: getTimerColor() }}
            />
            <Typography 
              variant="h6" 
              className="font-semibold"
              sx={{ color: getTimerColor() }}
            >
              Time Remaining
            </Typography>
          </Box>

          {/* Time Display */}
          <Box className="text-center">
            <Typography 
              variant="h3" 
              className="font-bold"
              sx={{ 
                color: getTimerColor(),
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {formatTime(timeRemaining)}
            </Typography>
            <Typography 
              variant="caption" 
              className="text-gray-600"
            >
              {Math.ceil(timeRemaining / 60)} minutes left
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box className="mt-4">
          <LinearProgress
            variant="determinate"
            value={progress}
            color={getProgressColor()}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                transition: 'all 0.3s ease',
              },
            }}
          />
          <Typography 
            variant="caption" 
            className="text-gray-600 mt-1 block text-center"
          >
            {Math.round(progress)}% completed
          </Typography>
        </Box>
      </Paper>

      {/* Warning Alerts */}
      {showCriticalWarning && (
        <Alert 
          severity="error" 
          icon={<Warning />}
          className="mb-4 animate-pulse"
          sx={{
            '& .MuiAlert-message': {
              fontWeight: 600,
            },
          }}
        >
          <Typography variant="body1" className="font-semibold">
            ⚠️ Critical: Less than {Math.ceil(criticalThreshold / 60)} minutes remaining!
          </Typography>
          <Typography variant="body2" className="mt-1">
            Please complete your quiz quickly. Time will auto-submit when it reaches zero.
          </Typography>
        </Alert>
      )}

      {showWarning && !showCriticalWarning && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          className="mb-4"
        >
          <Typography variant="body1" className="font-semibold">
            ⏰ Warning: Less than {Math.ceil(warningThreshold / 60)} minutes remaining
          </Typography>
          <Typography variant="body2" className="mt-1">
            Consider reviewing your answers and completing unanswered questions.
          </Typography>
        </Alert>
      )}

      {/* Time Status Indicators */}
      <Box className="flex justify-center space-x-4 text-sm text-gray-600">
        <Box className="flex items-center space-x-1">
          <Box className="w-3 h-3 bg-blue-500 rounded-full"></Box>
          <span>Normal</span>
        </Box>
        <Box className="flex items-center space-x-1">
          <Box className="w-3 h-3 bg-amber-500 rounded-full"></Box>
          <span>Warning</span>
        </Box>
        <Box className="flex items-center space-x-1">
          <Box className="w-3 h-3 bg-red-500 rounded-full"></Box>
          <span>Critical</span>
        </Box>
      </Box>
    </Box>
  );
} 