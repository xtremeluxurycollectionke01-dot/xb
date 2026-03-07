// types/auth.ts

export interface User {
  id: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  firstName: string;
  lastName: string;
  employeeId: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: {
    maxValue?: number;
    ownRecordsOnly?: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Session {
  id: string;
  device: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastUsedAt: string;
  isCurrent: boolean;
  isTrusted: boolean;
}

export interface SecurityEvent {
  id: string;
  action: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  ipAddress?: string;
  device?: string;
  details?: any;
}