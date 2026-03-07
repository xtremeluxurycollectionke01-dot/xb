'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/app/lib/utils'
import { FiCheck, FiX } from 'react-icons/fi'

interface PasswordStrengthProps {
  password: string
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  useEffect(() => {
    const newChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    setChecks(newChecks)
    
    const score = Object.values(newChecks).filter(Boolean).length
    setStrength(score)
  }, [password])

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  if (!password) return null

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn('h-full transition-all', getStrengthColor())}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className={cn(
          'text-xs font-medium',
          strength <= 2 && 'text-red-600',
          strength === 3 && 'text-yellow-600',
          strength === 4 && 'text-blue-600',
          strength === 5 && 'text-green-600'
        )}>
          {getStrengthText()}
        </span>
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          {checks.length ? (
            <FiCheck className="w-3 h-3 text-green-500" />
          ) : (
            <FiX className="w-3 h-3 text-red-500" />
          )}
          <span className={checks.length ? 'text-green-700' : 'text-gray-500'}>
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.uppercase ? (
            <FiCheck className="w-3 h-3 text-green-500" />
          ) : (
            <FiX className="w-3 h-3 text-red-500" />
          )}
          <span className={checks.uppercase ? 'text-green-700' : 'text-gray-500'}>
            Uppercase letter
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.lowercase ? (
            <FiCheck className="w-3 h-3 text-green-500" />
          ) : (
            <FiX className="w-3 h-3 text-red-500" />
          )}
          <span className={checks.lowercase ? 'text-green-700' : 'text-gray-500'}>
            Lowercase letter
          </span>
        </div>
        <div className="flex items-center gap-1">
          {checks.number ? (
            <FiCheck className="w-3 h-3 text-green-500" />
          ) : (
            <FiX className="w-3 h-3 text-red-500" />
          )}
          <span className={checks.number ? 'text-green-700' : 'text-gray-500'}>
            Number
          </span>
        </div>
        <div className="flex items-center gap-1 col-span-2">
          {checks.special ? (
            <FiCheck className="w-3 h-3 text-green-500" />
          ) : (
            <FiX className="w-3 h-3 text-red-500" />
          )}
          <span className={checks.special ? 'text-green-700' : 'text-gray-500'}>
            Special character (!@#$%^&*)
          </span>
        </div>
      </div>
    </div>
  )
}