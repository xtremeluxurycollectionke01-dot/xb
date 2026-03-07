'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'CLIENT' | 'ADMIN' | 'STAFF'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
    }
    
    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [isLoading, isAuthenticated, router, requiredRole, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--brand-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}