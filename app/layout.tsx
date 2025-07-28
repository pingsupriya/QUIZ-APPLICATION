import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeRegistry from '../components/ThemeRegistry'

// Import Inter font from Google Fonts
const inter = Inter({ subsets: ['latin'] })

// Metadata for the application
export const metadata: Metadata = {
  title: 'CausalFunnel Quiz Application',
  description: 'Interactive quiz application built with Next.js, React, and Material-UI',
  keywords: ['quiz', 'trivia', 'interactive', 'react', 'nextjs'],
  authors: [{ name: 'CausalFunnel Intern' }],
}

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

/**
 * Root layout component that wraps the entire application
 * Provides theme context and global styles
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Material-UI Theme Registry for consistent theming */}
        <ThemeRegistry>
          {/* Main application content */}
          <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  )
} 