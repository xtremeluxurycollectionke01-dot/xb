import type { Metadata } from 'next'
import { Suspense } from 'react'
import AuthLayout from '@/app/components/auth/AuthLayout'
import LoginForm from '@/app/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Linkchem Supplies',
  description: 'Sign in to your Linkchem account to manage orders, request quotes, and track deliveries.',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your account and manage your orders"
    >
      <Suspense fallback={
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--brand-500)] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}