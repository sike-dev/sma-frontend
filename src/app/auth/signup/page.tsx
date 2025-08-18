import { AuthLayout } from '@/components/auth/AuthLayout'
import { SignupForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back! Please sign in to continue."
    >
      <SignupForm />
    </AuthLayout>
  )
}