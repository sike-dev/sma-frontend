// utils/api.ts
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean
}

export const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { requiresAuth = true, ...requestOptions } = options
  const url = `${API_BASE_URL}${endpoint}`

  // Use Headers API (cleaner and type-safe)
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(requestOptions.headers as Record<string, string>),
  })

  // Add auth header if required
  if (requiresAuth) {
    const tokens = useAuthStore.getState().tokens
    if (tokens?.access_token) {
      headers.set('Authorization', `Bearer ${tokens.access_token}`)
    }
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers,
  })

  // Handle token expiration
  if (response.status === 401 && requiresAuth) {
    const { refreshToken, logout } = useAuthStore.getState()
    try {
      await refreshToken()
      // Retry with new token
      const newTokens = useAuthStore.getState().tokens
      if (newTokens?.access_token) {
        headers.set('Authorization', `Bearer ${newTokens.access_token}`)
        return fetch(url, {
          ...requestOptions,
          headers,
        })
      }
    } catch (error) {
      logout()
      throw new Error('Authentication failed')
    }
  }

  return response
}
