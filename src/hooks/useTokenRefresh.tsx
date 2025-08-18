'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

export const useTokenRefresh = () => {
  const { tokens, refreshToken, logout } = useAuthStore()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!tokens?.access_token || !tokens?.expires_in) {
      return
    }

    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    // Set up automatic token refresh
    // Refresh 5 minutes before expiry (or halfway through if token expires in less than 10 minutes)
    const refreshTime = Math.max(
      (tokens.expires_in * 1000) - (5 * 60 * 1000), // 5 minutes before expiry
      (tokens.expires_in * 1000) / 2 // or halfway through
    )

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        await refreshToken()
      } catch (error) {
        console.error('Token refresh failed:', error)
        logout()
      }
    }, refreshTime)

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [tokens, refreshToken, logout])
}