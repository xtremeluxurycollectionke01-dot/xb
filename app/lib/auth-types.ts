/*export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: 'CLIENT' | 'ADMIN' | 'STAFF'
  clientId?: string
  clientNumber?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  phone: string
  password: string
  name: string
  tradingName?: string
  businessType: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NGO'
  address?: string
  city?: string
  source?: 'WEB' | 'APP' | 'REFERRAL' | 'WALK_IN'
  referralCode?: string
  acceptTerms: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    client: {
      id: string
      clientNumber: string
      name: string
      category: string
    }
    session: {
      token: string
      refreshToken: string
      expiresAt: string
    }
  }
  error?: string
  details?: string[]
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}*/
export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'STAFF' | 'READONLY' | 'CLIENT'
  accountType: 'CLIENT' | 'STAFF' | 'BOTH' | 'ADMIN'
  clientId?: string
  clientNumber?: string
  mustChangePassword?: boolean
}

export interface Client {
  id: string
  clientNumber: string
  name: string
  category: 'RETAIL' | 'WHOLESALE' | 'SPECIAL' | 'EMPLOYEE' | 'VIP'
  account?: {
    balanceDue: number
    availableCredit: number
    creditLimit: number
  }
  flags?: {
    onHold: boolean
    creditSuspended: boolean
    preferred: boolean
  }
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  phone: string
  password: string
  name: string
  tradingName?: string
  businessType: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NGO'
  address?: string
  city?: string
  source?: 'WEB' | 'APP' | 'REFERRAL' | 'WALK_IN'
  referralCode?: string
  acceptTerms: boolean
}

export interface Session {
  token: string
  refreshToken: string
  expiresAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    client?: Client | null
    session: Session
  }
  error?: string
  details?: string[]
  requiresPasswordChange?: boolean
  lockedUntil?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface MeResponse {
  success: boolean
  data: {
    user: User
    client?: Client | null
  }
}