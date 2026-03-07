'use client'

import Link from 'next/link'
import Container from '../layout/Container'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  illustration?: boolean
}

export default function AuthLayout({ children, title, subtitle, illustration = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)]">
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Column - Form */}
          <div className="bg-white dark:bg-[var(--dark-text)] rounded-2xl shadow-xl p-8 md:p-10">
            <div className="mb-8">
              <Link href="/" className="inline-block mb-6">
                <span className="text-2xl font-bold text-[var(--brand-500)]">
                  Link<span className="text-[var(--brand-700)]">chem</span>
                </span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--dark-text)] mb-2">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          {/* Right Column - Illustration */}
          {illustration && (
            <div className="hidden lg:block relative">
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[var(--brand-800)] dark:text-[var(--brand-200)] mb-4">
                    Welcome to Linkchem Supplies
                  </h2>
                  <p className="text-lg text-[var(--brand-700)] dark:text-[var(--brand-300)]">
                    Your trusted partner in laboratory and scientific supplies
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="relative h-[400px]">
                  {/* Floating Cards */}
                  <div className="absolute top-0 left-0 w-64 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl animate-float">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[var(--brand-100)] rounded-full" />
                      <div className="flex-1">
                        <div className="h-3 w-20 bg-[var(--brand-200)] rounded" />
                        <div className="h-2 w-16 bg-gray-200 rounded mt-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded" />
                      <div className="h-2 w-3/4 bg-gray-100 rounded" />
                    </div>
                  </div>

                  <div className="absolute top-32 right-0 w-64 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl animate-float-delayed">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 w-24 bg-[var(--brand-200)] rounded" />
                      <div className="h-6 w-16 bg-[var(--brand-500)] rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded" />
                      <div className="h-2 w-full bg-gray-100 rounded" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-20 w-72 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl animate-float-slow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[var(--brand-500)] rounded-full flex items-center justify-center text-white text-xl">
                        ✓
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-[var(--brand-300)] rounded mb-2" />
                        <div className="h-2 w-48 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Abstract Shapes */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                    <circle cx="100" cy="100" r="40" fill="var(--brand-200)" opacity="0.2" />
                    <circle cx="300" cy="300" r="60" fill="var(--brand-300)" opacity="0.2" />
                    <circle cx="350" cy="50" r="30" fill="var(--brand-400)" opacity="0.2" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 7s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite 0.5s;
        }
      `}</style>
    </div>
  )
}