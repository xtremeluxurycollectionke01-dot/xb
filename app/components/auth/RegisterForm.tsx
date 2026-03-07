'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '@/app/hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import PasswordStrength from '../ui/PasswordStrength'
import { cn } from '@/app/lib/utils'
import { FaBuilding } from 'react-icons/fa6'

type BusinessType = 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NGO'

export default function RegisterForm() {
  const router = useRouter()
  const { register, isLoading, error, clearError, checkAvailability } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    tradingName: '',
    businessType: 'INDIVIDUAL' as BusinessType,
    address: '',
    city: 'Nairobi',
    source: 'WEB' as const,
    referralCode: '',
    acceptTerms: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availability, setAvailability] = useState({
    email: true,
    phone: true,
    checking: false
  })
  const [currentStep, setCurrentStep] = useState(1)

  // Debounced availability checks
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (formData.email && !errors.email) {
        setAvailability(prev => ({ ...prev, checking: true }))
        const result = await checkAvailability('email', formData.email)
        setAvailability(prev => ({ 
          ...prev, 
          email: result.available,
          checking: false 
        }))
        
        if (!result.available) {
          setErrors(prev => ({
            ...prev,
            email: 'Email already registered'
          }))
        }
      }
    }

    const timer = setTimeout(checkEmailAvailability, 500)
    return () => clearTimeout(timer)
  }, [formData.email, checkAvailability, errors.email])

  useEffect(() => {
    const checkPhoneAvailability = async () => {
      if (formData.phone && !errors.phone) {
        const result = await checkAvailability('phone', formData.phone)
        setAvailability(prev => ({ ...prev, phone: result.available }))
        
        if (!result.available) {
          setErrors(prev => ({
            ...prev,
            phone: 'Phone number already registered'
          }))
        }
      }
    }

    const timer = setTimeout(checkPhoneAvailability, 500)
    return () => clearTimeout(timer)
  }, [formData.phone, checkAvailability, errors.phone])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    } else if (!availability.email) {
      newErrors.email = 'Email already registered'
    }
    
    // Phone validation (Kenya format)
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^(\+254|0)[17]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Valid Kenyan phone number required (e.g., 0712345678)'
    } else if (!availability.phone) {
      newErrors.phone = 'Phone number already registered'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Name validation
    if (!formData.name) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    // Business type specific validations
    if (formData.businessType !== 'INDIVIDUAL' && !formData.tradingName) {
      newErrors.tradingName = 'Trading name is required for businesses'
    }
    
    // Terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
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
    
    await register(formData)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first step fields
      const step1Errors: Record<string, string> = {}
      
      if (!formData.email) step1Errors.email = 'Email is required'
      if (!formData.phone) step1Errors.phone = 'Phone is required'
      if (!formData.password) step1Errors.password = 'Password is required'
      if (formData.password !== formData.confirmPassword) {
        step1Errors.confirmPassword = 'Passwords do not match'
      }
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors)
        return
      }
      
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={cn(
          'flex-1 h-1 rounded-full transition-colors',
          currentStep >= 1 ? 'bg-[var(--brand-500)]' : 'bg-gray-200'
        )} />
        <div className={cn(
          'flex-1 h-1 rounded-full transition-colors',
          currentStep >= 2 ? 'bg-[var(--brand-500)]' : 'bg-gray-200'
        )} />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Account Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--dark-text)]">Account Details</h3>
          
          {/* Email */}
          <Input
            label="Email Address *"
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

          {/* Phone */}
          <Input
            label="Phone Number *"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="0712345678"
            leftIcon={<FiPhone className="w-5 h-5 text-gray-400" />}
            disabled={isLoading}
            autoComplete="tel"
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a strong password"
              leftIcon={<FiLock className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          
          <PasswordStrength password={formData.password} />

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password *"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
              leftIcon={<FiLock className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            type="button"
            onClick={nextStep}
            size="lg"
            fullWidth
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Personal & Business Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--dark-text)]">Personal & Business Details</h3>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--dark-text)] mb-2">
              Account Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'INDIVIDUAL', label: 'Individual' },
                { value: 'BUSINESS', label: 'Business' },
                { value: 'GOVERNMENT', label: 'Government' },
                { value: 'NGO', label: 'NGO' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, businessType: type.value as BusinessType }))}
                  className={cn(
                    'p-3 border rounded-lg text-sm font-medium transition-all',
                    formData.businessType === type.value
                      ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                      : 'border-[var(--card-border)] hover:border-[var(--brand-300)]'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <Input
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="John Doe"
            leftIcon={<FiUser className="w-5 h-5 text-gray-400" />}
            disabled={isLoading}
          />

          {/* Trading Name (for businesses) */}
          {formData.businessType !== 'INDIVIDUAL' && (
            <Input
              label="Trading Name *"
              name="tradingName"
              value={formData.tradingName}
              onChange={handleChange}
              error={errors.tradingName}
              placeholder="Business name"
              leftIcon={<FaBuilding className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
            />
          )}

          {/* Address */}
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
            leftIcon={<FiMapPin className="w-5 h-5 text-gray-400" />}
            disabled={isLoading}
          />

          {/* City */}
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Nairobi"
            disabled={isLoading}
          />

          {/* Referral Code */}
          <Input
            label="Referral Code (Optional)"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Enter referral code if you have one"
            disabled={isLoading}
          />

          {/* Terms Acceptance */}
          <div className="space-y-2">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              label={
                <span className="text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[var(--brand-600)] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[var(--brand-600)] hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              }
              disabled={isLoading}
            />
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Login Link */}
      <div className="text-center pt-4 border-t border-[var(--card-border)]">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[var(--brand-600)] hover:text-[var(--brand-700)] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}