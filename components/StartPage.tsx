/**
 * StartPage Component
 * Displays the initial page where users enter their email to start the quiz
 * Includes email validation and loading states
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { Email, PlayArrow, School } from '@mui/icons-material';
import { validateEmail } from '../utils/api';

// Interface for component props
interface StartPageProps {
  onStartQuiz: (email: string) => void;
  isLoading: boolean;
}

/**
 * StartPage component - Entry point for the quiz application
 * @param onStartQuiz - Callback function to start the quiz with user email
 * @param isLoading - Loading state for API calls
 */
export default function StartPage({ onStartQuiz, isLoading }: StartPageProps) {
  // State for email input and validation
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Handles email input changes
   * @param event - Input change event
   */
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  /**
   * Validates email and starts the quiz
   */
  const handleStartQuiz = async () => {
    // Trim whitespace from email
    const trimmedEmail = email.trim();
    
    // Check if email is empty
    if (!trimmedEmail) {
      setEmailError('Please enter your email address');
      return;
    }

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsValidating(true);
    
    try {
      // Simulate a brief validation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Start the quiz with validated email
      onStartQuiz(trimmedEmail);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Handles form submission on Enter key press
   * @param event - Form submit event
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleStartQuiz();
  };

  return (
    <Container maxWidth="sm" className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/20 rounded-full animate-float-delay-1"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-float-delay-2"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-indigo-400/20 rounded-full animate-float-delay-3"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      <Paper 
        elevation={8} 
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl relative z-10"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header Section */}
        <Box className="text-center mb-8">
          <School className="text-6xl mb-4 text-white" />
          <Typography 
            variant="h3" 
            component="h1" 
            className="font-bold mb-2 text-white"
            sx={{ fontWeight: 700 }}
          >
            Quiz Challenge
          </Typography>
          <Typography 
            variant="h6" 
            className="text-blue-100 mb-4"
            sx={{ opacity: 0.9 }}
          >
            Test your knowledge with 15 exciting questions!
          </Typography>
        </Box>

        {/* Quiz Information */}
        <Card className="mb-6 bg-gray-100 backdrop-blur-sm border border-gray-200">
          <CardContent className="p-4">
            <Typography variant="h6" className="text-gray-800 font-semibold mb-3">
              Quiz Details:
            </Typography>
            <Box className="space-y-2">
              <Typography variant="body2" className="flex items-center text-gray-700 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                15 Multiple Choice Questions
              </Typography>
              <Typography variant="body2" className="flex items-center text-gray-700 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                30 Minutes Time Limit
              </Typography>
              <Typography variant="body2" className="flex items-center text-gray-700 font-medium">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Instant Results & Review
              </Typography>
              <Typography variant="body2" className="flex items-center text-gray-700 font-medium">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></span>
                Questions from Open Trivia Database
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Box>
            <Typography 
              variant="h6" 
              className="text-white font-semibold mb-3"
            >
              Enter Your Email to Begin
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your.email@example.com"
              variant="outlined"
              error={!!emailError}
              helperText={emailError}
              disabled={isLoading || isValidating}
              InputProps={{
                startAdornment: <Email className="text-gray-400 mr-2" />,
                className: 'bg-white/90 backdrop-blur-sm',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                },
              }}
              sx={{
                '& .MuiFormHelperText-root': {
                  color: '#fecaca',
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Error Alert */}
          {emailError && (
            <Alert 
              severity="error" 
              className="bg-red-50 border border-red-200"
              sx={{
                '& .MuiAlert-message': {
                  color: '#dc2626',
                },
              }}
            >
              {emailError}
            </Alert>
          )}

          {/* Start Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            disabled={isLoading || isValidating || !email.trim()}
            startIcon={
              isLoading || isValidating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PlayArrow />
              )
            }
            className="h-12 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-100 transition-all duration-200"
            sx={{
              background: 'white',
              color: '#7c3aed',
              '&:hover': {
                background: '#f8fafc',
                transform: 'translateY(-1px)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              },
              '&:disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
              },
            }}
          >
            {isLoading || isValidating ? 'Starting Quiz...' : 'Start Quiz'}
          </Button>
        </form>

        {/* Footer */}
        <Box className="text-center mt-6">
          <Typography 
            variant="caption" 
            className="text-blue-200"
            sx={{ opacity: 0.8 }}
          >
            Powered by Open Trivia Database
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 