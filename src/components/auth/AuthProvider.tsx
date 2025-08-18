'use client'

import React, { useEffect } from 'react'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'
import { useAuthStore } from '@/store/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { tokens, refreshToken } = useAuthStore()
  
  // Set up automatic token refresh
  useTokenRefresh()

  // Check token validity on mount
  useEffect(() => {
    if (tokens?.refresh_token) {
      // Optionally validate token on app start
      refreshToken().catch(() => {
        // Token refresh failed, user will be logged out by the hook
      })
    }
  }, [])

  return <>{children}</>
}