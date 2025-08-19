import { AuthLayout } from '@/components/auth/AuthLayout'
import { SignupForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <AuthLayout
      title="SMA"
      subtitle="A swiss army knife for developers. Create your account now."
    >
      <SignupForm />
    </AuthLayout>
  )
}