import type { Metadata } from 'next'
import { Suspense } from 'react'
import AuthLayout from '@/app/components/auth/AuthLayout'
import RegisterForm from '@/app/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account | Linkchem Supplies',
  description: 'Create your Linkchem account to start ordering laboratory supplies and requesting quotes.',
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of satisfied customers in Kenya"
    >
      <Suspense fallback={
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--brand-500)] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  )
}