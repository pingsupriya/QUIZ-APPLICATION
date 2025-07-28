'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box className="min-h-screen flex items-center justify-center p-4">
          <Box className="text-center max-w-md">
            <Alert severity="error" className="mb-4">
              <Typography variant="h6" className="font-semibold mb-2">
                Something went wrong
              </Typography>
              <Typography variant="body2" className="mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </Typography>
            </Alert>
            
            <Box className="space-y-3">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                fullWidth
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                fullWidth
              >
                Go to Home
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
} 