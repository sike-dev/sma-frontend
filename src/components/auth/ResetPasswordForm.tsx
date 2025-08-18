// components/auth/ResetPasswordForm.tsx
'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Check, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export const ResetPasswordForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') || ''
  
  const { resetPassword, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const validatePassword = (password: string) => {
    const strength = {
      hasLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    setPasswordStrength(strength)
    return Object.values(strength).every(Boolean)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!token) {
      errors.token = 'Invalid or missing reset token'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password does not meet requirements'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!validateForm()) return

    try {
      await resetPassword(token, formData.password)
      setIsSuccess(true)
    } catch (error) {
      // Error is handled in the store
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Update password strength in real-time
    if (field === 'password') {
      validatePassword(value)
    }
  }

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      <Check className={`w-3 h-3 mr-1 ${met ? 'opacity-100' : 'opacity-30'}`} />
      {text}
    </div>
  )

  // Check for invalid token
  if (!token) {
    return (
      <div className="text-center space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Invalid or missing reset token. Please request a new password reset link.
          </AlertDescription>
        </Alert>
        
        <Link href="/auth/forgot-password">
          <Button variant="outline" className="w-full">
            Request new reset link
          </Button>
        </Link>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Password reset successful</h3>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>

        <Link href="/auth/login">
          <Button className="w-full">
            Continue to sign in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Enter your new password below to complete the reset process.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
            placeholder="Create a secure password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        
        {formData.password && (
          <div className="mt-2 space-y-1">
            <PasswordRequirement met={passwordStrength.hasLength} text="At least 8 characters" />
            <PasswordRequirement met={passwordStrength.hasUppercase} text="One uppercase letter" />
            <PasswordRequirement met={passwordStrength.hasLowercase} text="One lowercase letter" />
            <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
            <PasswordRequirement met={passwordStrength.hasSpecial} text="One special character" />
          </div>
        )}
        
        {validationErrors.password && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={validationErrors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Resetting password...
          </>
        ) : (
          'Reset password'
        )}
      </Button>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  )
}