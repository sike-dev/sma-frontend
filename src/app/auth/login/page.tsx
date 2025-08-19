import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout
      title="SMA"
      subtitle="A swiss army knife for developers."
    >
      <LoginForm />
    </AuthLayout>
  )
}