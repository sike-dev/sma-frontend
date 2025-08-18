'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export const useAuthGuard = () => {
  const router = useRouter()
  const { isAuthenticated, tokens } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !tokens) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, tokens, router])

  return { isAuthenticated }
}
