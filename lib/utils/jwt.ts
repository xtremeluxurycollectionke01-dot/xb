/**
 * JWT Token Management
 * Handles access and refresh token generation/verification
 */
/*
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface TokenPayload {
  userId: string;
  staffId: string;
  employeeId: string;
  role: string;
  roleLevel: number;
  sessionId: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate access and refresh tokens
 *
export function generateTokens(payload: Omit<TokenPayload, 'sessionId'> & { sessionId?: string }): Tokens {
  const sessionId = payload.sessionId || generateSessionId();
  
  const tokenPayload: TokenPayload = {
    ...payload,
    sessionId
  };

  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: '8h'
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId, sessionId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 28800 // 8 hours in seconds
  };
}

/**
 * Verify access token
 *
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify refresh token
 *
export function verifyRefreshToken(token: string): { userId: string; sessionId: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string; sessionId: string };
  } catch {
    return null;
  }
}

/**
 * Generate random session ID
 *
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Extract token from Authorization header
 *
export function extractTokenFromHeader(header: string | null): string | null {
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}*/

/**
 * JWT Token Management
 * Handles access and refresh token generation/verification
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface TokenPayload {
  userId: string;
  staffId?: string;        // Optional - only for staff users
  clientId?: string;        // Optional - only for client users
  employeeId?: string;      // Optional - only for staff users
  email?: string;           // Added for easier context
  role: string;
  roleLevel: number;
  accountType: string;      // CLIENT | STAFF | BOTH | ADMIN
  sessionId: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;        // Seconds until expiry
}

/**
 * Generate access and refresh tokens
 */
export function generateTokens(payload: {
  userId: string;
  staffId?: string;
  clientId?: string;
  employeeId?: string;
  email?: string;
  role: string;
  roleLevel: number;
  accountType: string;
  sessionId?: string;
}): Tokens {
  const sessionId = payload.sessionId || generateSessionId();
  
  const tokenPayload: TokenPayload = {
    userId: payload.userId,
    staffId: payload.staffId,
    clientId: payload.clientId,
    employeeId: payload.employeeId,
    email: payload.email,
    role: payload.role,
    roleLevel: payload.roleLevel,
    accountType: payload.accountType,
    sessionId
  };

  // Filter out undefined values to keep token smaller
  const cleanPayload = Object.fromEntries(
    Object.entries(tokenPayload).filter(([_, v]) => v !== undefined)
  );

  const accessToken = jwt.sign(cleanPayload, JWT_SECRET, {
    expiresIn: '8h',
    issuer: 'malex-system',
    audience: 'malex-api'
  });

  const refreshToken = jwt.sign(
    { 
      userId: payload.userId, 
      sessionId,
      accountType: payload.accountType // Include for refresh context
    },
    JWT_REFRESH_SECRET,
    { 
      expiresIn: '7d',
      issuer: 'malex-system',
      audience: 'malex-api'
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 28800 // 8 hours in seconds
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'malex-system',
      audience: 'malex-api'
    }) as jwt.JwtPayload;
    
    // Ensure all required fields exist
    if (!decoded.userId || !decoded.role || !decoded.sessionId) {
      return null;
    }

    return {
      userId: decoded.userId,
      staffId: decoded.staffId,
      clientId: decoded.clientId,
      employeeId: decoded.employeeId,
      email: decoded.email,
      role: decoded.role,
      roleLevel: decoded.roleLevel || 0,
      accountType: decoded.accountType || (decoded.role === 'CLIENT' ? 'CLIENT' : 'STAFF'),
      sessionId: decoded.sessionId
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { 
  userId: string; 
  sessionId: string;
  accountType?: string;
} | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'malex-system',
      audience: 'malex-api'
    }) as jwt.JwtPayload;
    
    if (!decoded.userId || !decoded.sessionId) {
      return null;
    }

    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      accountType: decoded.accountType
    };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Generate random session ID
 */
function generateSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(header: string | null): string | null {
  if (!header) return null;
  
  const parts = header.split(' ');
  if (parts.length !== 2) return null;
  
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;
  
  return token;
}

/**
 * Decode token without verification (for debugging/info)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded) return null;
    
    return {
      userId: decoded.userId,
      staffId: decoded.staffId,
      clientId: decoded.clientId,
      employeeId: decoded.employeeId,
      email: decoded.email,
      role: decoded.role,
      roleLevel: decoded.roleLevel,
      accountType: decoded.accountType,
      sessionId: decoded.sessionId
    };
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded || !decoded.exp) return true;
    
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiry(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
export function refreshAccessToken(refreshToken: string): Tokens | null {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;
  
  // You would typically fetch the user from database here
  // to get latest role/permissions
  // This is a simplified version - in production, query the user
  
  return generateTokens({
    userId: payload.userId,
    sessionId: payload.sessionId,
    role: 'STAFF', // This should come from DB
    roleLevel: 1,
    accountType: 'STAFF'
    // Other fields would come from DB
  });
}

/**
 * Create session ID from token
 */
export function getSessionIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    return decoded?.sessionId || null;
  } catch {
    return null;
  }
}

/**
 * Middleware helper - Check if user has required role
 */
export function hasRequiredRole(
  tokenPayload: TokenPayload | null,
  allowedRoles: string[]
): boolean {
  if (!tokenPayload) return false;
  if (tokenPayload.role === 'ADMIN') return true; // Admin override
  return allowedRoles.includes(tokenPayload.role);
}

/**
 * Middleware helper - Check if user can access resource
 */
export function canAccessResource(
  tokenPayload: TokenPayload | null,
  resourceUserId?: string,
  resourceClientId?: string
): boolean {
  if (!tokenPayload) return false;
  
  // Admin can access anything
  if (tokenPayload.role === 'ADMIN') return true;
  
  // Staff can access based on permissions (handled in permission system)
  if (tokenPayload.accountType === 'STAFF' || tokenPayload.accountType === 'ADMIN') {
    return true; // Let the permission system handle it
  }
  
  // Client can only access their own resources
  if (tokenPayload.accountType === 'CLIENT') {
    // Check if user owns the resource by userId
    const ownsByUserId = resourceUserId ? resourceUserId === tokenPayload.userId : false;
    
    // Check if user owns the resource by clientId
    const ownsByClientId = resourceClientId && tokenPayload.clientId 
      ? resourceClientId === tokenPayload.clientId 
      : false;
    
    return ownsByUserId || ownsByClientId;
  }
  
  return false;
}