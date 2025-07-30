# Quiz Application

A modern, interactive quiz application built with Next.js, React, TypeScript, Material-UI, and Tailwind CSS. This application fetches trivia questions from the Open Trivia Database API and provides a comprehensive quiz experience with timer, navigation, and detailed results.

## 🎯 Project Overview

It demonstrates modern web development practices, clean code architecture, and attention to detail in implementing all specified requirements of the application.

### Key Features Implemented

✅ **Complete Quiz Flow**: Start page with email validation → 15 questions → Results page  
✅ **30-Minute Timer**: Countdown timer with visual warnings and auto-submit  
✅ **Question Navigation**: Grid view showing visited/answered questions with status indicators  
✅ **API Integration**: Fetches questions from Open Trivia Database API  
✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices  
✅ **Modern UI/UX**: Beautiful interface with smooth animations and transitions  
✅ **Type Safety**: Full TypeScript implementation with comprehensive type definitions  
✅ **Error Handling**: Robust error handling for API calls and user interactions  
✅ **Accessibility**: Keyboard navigation and screen reader support  

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd causal-funnel-quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Technical Architecture

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + Material-UI
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **API**: Open Trivia Database (https://opentdb.com/api.php)

### Project Structure

```
causal-funnel-quiz-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main quiz application page
├── components/            # React components
│   ├── StartPage.tsx      # Email entry and quiz start
│   ├── Timer.tsx          # Countdown timer component
│   ├── QuestionNavigation.tsx # Question grid navigation
│   ├── QuizQuestion.tsx   # Individual question display
│   └── QuizResults.tsx    # Results and review page
├── types/                 # TypeScript type definitions
│   └── quiz.ts           # Quiz-related interfaces
├── utils/                 # Utility functions
│   └── api.ts            # API integration and helpers
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

### Key Components

1. **StartPage**: Handles email validation and quiz initialization
2. **Timer**: Displays countdown with visual warnings and auto-submit
3. **QuestionNavigation**: Grid view for question status and navigation
4. **QuizQuestion**: Individual question display with multiple choice options
5. **QuizResults**: Comprehensive results with detailed breakdown

## 🎨 Design Features

### User Experience
- **Smooth Transitions**: CSS animations and Material-UI transitions
- **Visual Feedback**: Color-coded status indicators and progress bars
- **Responsive Layout**: Mobile-first design with breakpoint optimization
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Visual Design
- **Modern Aesthetics**: Clean, professional interface with gradient backgrounds
- **Status Indicators**: Color-coded question states (visited, answered, current)
- **Progress Visualization**: Timer progress bar and quiz completion tracking
- **Interactive Elements**: Hover effects and click animations

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The application uses the public Open Trivia Database API.

### Customization Options

You can modify the following constants in `app/page.tsx`:
- `TOTAL_QUESTIONS`: Number of questions (default: 15)
- `TOTAL_TIME`: Quiz duration in seconds (default: 30 minutes)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🧪 Testing

The application includes comprehensive error handling and edge case management:

- **API Error Handling**: Graceful fallbacks for network issues
- **Input Validation**: Email format validation and sanitization
- **Timer Management**: Proper cleanup and state management
- **Navigation Safety**: Prevents invalid state transitions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Environment variables: None required

### Other Platforms
The application can be deployed to any platform that supports Next.js applications.

## 📋 Requirements Fulfillment

### ✅ Core Requirements
- [x] Start page with email submission
- [x] 15 questions from Open Trivia Database API
- [x] 30-minute countdown timer with auto-submit
- [x] Question navigation with status indicators
- [x] Results page with user vs correct answers
- [x] Responsive design for all devices

### ✅ Bonus Features
- [x] Responsive design with mobile optimization
- [x] Cross-browser compatibility
- [x] Smooth transitions and animations
- [x] Enhanced user experience features
- [x] Professional UI/UX design

## 🔍 Code Quality

### Best Practices Implemented
- **TypeScript**: Full type safety with comprehensive interfaces
- **Component Architecture**: Modular, reusable components
- **Error Handling**: Robust error boundaries and user feedback
- **Performance**: Optimized rendering and state management
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Input sanitization and XSS prevention

### Code Comments
Every component and function includes detailed JSDoc comments explaining:
- Purpose and functionality
- Parameter descriptions
- Return value explanations
- Usage examples where applicable



### HAVE A GREAT TIME
