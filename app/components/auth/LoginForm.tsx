'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '@/app/hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'

export default function LoginForm() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    // Clear global error
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    await login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    })
  }

  // Demo credentials for testing
  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@labpro.co.ke',
      password: 'Demo123!',
      rememberMe: false
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="you@example.com"
        leftIcon={<FiMail className="w-5 h-5 text-gray-400" />}
        disabled={isLoading}
        autoComplete="email"
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          leftIcon={<FiLock className="w-5 h-5 text-gray-400" />}
          disabled={isLoading}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          label="Remember me"
          disabled={isLoading}
        />
        
        <Link
          href="/forgot-password"
          className="text-sm text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Demo Credentials */}
      <div className="text-center">
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-sm text-gray-500 hover:text-[var(--brand-600)] transition-colors"
        >
          Use demo credentials
        </button>
      </div>

      {/* Register Link */}
      <div className="text-center pt-4 border-t border-[var(--card-border)]">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-[var(--brand-600)] hover:text-[var(--brand-700)] font-medium transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>

      {/* Terms Notice */}
      <p className="text-xs text-center text-gray-500">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-[var(--brand-600)] hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[var(--brand-600)] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  )
}