// components/auth/AuthLayout.tsx
import React from 'react'
import { ModeToggle } from '../widgets/mode-toggle'
import { Navbar1 } from '../navbar1'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (

    <div className="min-h-screen flex flex-col">
        <Navbar1 />
        
      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Sike</h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
