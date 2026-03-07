/*'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '@/app/lib/auth-types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAvailability: (field: 'email' | 'phone', value: string) => Promise<{ available: boolean }>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for development - remove when backend is ready
const MOCK_USER: User = {
  id: '1',
  email: 'john@example.com',
  phone: '+254712345678',
  name: 'John Doe',
  role: 'CLIENT',
  clientId: 'client123',
  clientNumber: 'C-000001'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false
  })
  
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // TODO: Validate token with backend
          // For now, use mock user
          setState({
            user: MOCK_USER,
            isLoading: false,
            error: null,
            isAuthenticated: true
          })
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: 'Session validation failed',
          isAuthenticated: false
        })
      }
    }

    checkSession()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // })
      // const data: AuthResponse = await response.json()
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      if (credentials.email === 'demo@labpro.co.ke' && credentials.password === 'Demo123!') {
        const mockResponse: AuthResponse = {
          success: true,
          message: 'Login successful',
          data: {
            user: MOCK_USER,
            client: {
              id: 'client123',
              clientNumber: 'C-000001',
              name: 'Demo Client',
              category: 'RETAIL'
            },
            session: {
              token: 'mock_jwt_token',
              refreshToken: 'mock_refresh_token',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
          }
        }

        // Store token
        localStorage.setItem('auth_token', mockResponse.data!.session.token)
        localStorage.setItem('refresh_token', mockResponse.data!.session.refreshToken)

        setState({
          user: mockResponse.data!.user,
          isLoading: false,
          error: null,
          isAuthenticated: true
        })

        router.push('/')
        router.refresh()
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false
      })
    }
  }

  const register = async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // TODO: Replace with actual API call to your registration endpoint
      const response = await fetch('/api/auth/register-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      // Store token if auto-login after registration
      if (result.data?.session) {
        localStorage.setItem('auth_token', result.data.session.token)
        localStorage.setItem('refresh_token', result.data.session.refreshToken)

        setState({
          user: result.data.user,
          isLoading: false,
          error: null,
          isAuthenticated: true
        })

        router.push('/')
        router.refresh()
      } else {
        // Redirect to login if email verification required
        router.push('/login?registered=true')
      }
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Registration failed',
        isAuthenticated: false
      })
    }
  }

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // TODO: Call logout endpoint
      // await fetch('/api/auth/logout', { method: 'POST' })
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      })
      
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if API fails
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      })
    }
  }

  const checkAvailability = async (field: 'email' | 'phone', value: string): Promise<{ available: boolean }> => {
    try {
      const response = await fetch(`/api/auth/register-client?${field}=${encodeURIComponent(value)}`)
      const data = await response.json()
      return { available: data.available }
    } catch (error) {
      console.error('Availability check failed:', error)
      return { available: true } // Assume available on error to avoid blocking
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      checkAvailability,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}*/

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '@/app/lib/auth-types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAvailability: (field: 'email' | 'phone', value: string) => Promise<{ available: boolean }>
  clearError: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false
  })
  
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          setState(prev => ({ ...prev, isLoading: false }))
          return
        }

        // Validate token with /api/auth/me
        const response = await fetch('/api/auth/me-client', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setState({
            user: result.data.user,
            isLoading: false,
            error: null,
            isAuthenticated: true
          })

          // Check if password change required
          if (result.data.user.mustChangePassword) {
            router.push('/change-password?required=true')
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          setState({
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false
          })
        }
      } catch (error) {
        console.error('Session validation error:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        setState({
          user: null,
          isLoading: false,
          error: 'Session validation failed',
          isAuthenticated: false
        })
      }
    }

    checkSession()
  }, [router])

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/auth/login-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const result: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      if (!result.data) {
        throw new Error('Invalid response from server')
      }

      // Store tokens
      localStorage.setItem('auth_token', result.data.session.token)
      localStorage.setItem('refresh_token', result.data.session.refreshToken)

      setState({
        user: result.data.user,
        isLoading: false,
        error: null,
        isAuthenticated: true
      })

      // Check if password change required
      if (result.data.user.mustChangePassword) {
        router.push('/change-password?required=true')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false
      })
    }
  }

  const register = async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/auth/register-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      // Store token if auto-login after registration
      if (result.data?.session) {
        localStorage.setItem('auth_token', result.data.session.token)
        localStorage.setItem('refresh_token', result.data.session.refreshToken)

        setState({
          user: result.data.user,
          isLoading: false,
          error: null,
          isAuthenticated: true
        })

        router.push('/')
        router.refresh()
      } else {
        // Redirect to login if email verification required
        router.push('/login?registered=true')
      }
    } catch (error: any) {
      setState({
        user: null,
        isLoading: false,
        error: error.message || 'Registration failed',
        isAuthenticated: false
      })
    }
  }

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const token = localStorage.getItem('auth_token')
      
      if (token) {
        // Call logout endpoint
        await fetch('/api/auth/logout-client', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      })
      
      router.push('/')
      router.refresh()
    }
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch('/api/auth/me-client', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setState(prev => ({
          ...prev,
          user: result.data.user,
          isAuthenticated: true
        }))
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const checkAvailability = async (field: 'email' | 'phone', value: string): Promise<{ available: boolean }> => {
    try {
      const response = await fetch(`/api/auth/register-client?${field}=${encodeURIComponent(value)}`)
      const data = await response.json()
      return { available: data.available }
    } catch (error) {
      console.error('Availability check failed:', error)
      return { available: true } // Assume available on error to avoid blocking
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      checkAvailability,
      clearError,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}