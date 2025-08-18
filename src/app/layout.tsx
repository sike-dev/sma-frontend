// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/widgets/mode-toggle'
import { Toaster } from '@/components/ui/sonner'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AppNetwork - Integrated Application Suite',
  description: 'Connect, collaborate, and create with our integrated suite of applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  )
}