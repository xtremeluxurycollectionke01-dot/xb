// ============================================================================
// AUTHENTICATION & AUTHORIZATION MODULE
// ============================================================================
// Core Purpose: Identity verification, access control, and action accountability
// Philosophy: Invitation-only, role-based, fully audited, zero-trust security
// Interconnections:
//   - Links to Staff module (identity source)
//   - Triggers Time Management (login/logout tracking)
//   - Feeds Dashboard (active sessions, security alerts)
//   - Logs to Messaging (security notifications)
//   - Provides permissions to all API endpoints
// ============================================================================

/*import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';


interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  comparePin(candidatePin: string): Promise<boolean>;
  hasPermission(resource: ResourceType, action: ActionType, context?: any): boolean;
  recordLoginAttempt(success: boolean, details: any): Promise<void>;
  createSession(deviceInfo: any): Promise<ISession>;
  revokeSession(sessionId: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  lockAccount(durationMinutes: number): void;
  unlockAccount(): void;
  generatePasswordResetToken(): string;
  getPublicProfile(): any;
}

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * System roles mapped to her team hierarchy
 *
export type SystemRole = 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'STAFF' | 'READONLY';

/**
 * Role levels for hierarchy checks
 *
export type RoleLevel = 4 | 3 | 2 | 1 | 0;

/**
 * Resources that can be accessed
 *
export type ResourceType = 
  | 'ORDER' 
  | 'INVOICE' 
  | 'QUOTATION' 
  | 'PRICE' 
  | 'PRODUCT' 
  | 'STOCK' 
  | 'PACKING' 
  | 'DELIVERY'
  | 'CLIENT' 
  | 'STAFF' 
  | 'REPORT' 
  | 'DASHBOARD' 
  | 'SETTINGS' 
  | 'SYSTEM';

/**
 * Actions that can be performed on resources
 *
export type ActionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT' | 'ADMIN';

/**
 * User account status
 *
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'INACTIVE';

/**
 * Login methods
 *
export type LoginMethod = 'PASSWORD' | 'SMS' | 'EMAIL_LINK' | 'PIN' | 'RFID' | 'BIOMETRIC';

/**
 * Security action types for audit log
 *
export type SecurityAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'LOGIN_FAILED' 
  | 'PASSWORD_CHANGE' 
  | 'PASSWORD_RESET'
  | 'PERMISSION_DENIED' 
  | 'SESSION_EXPIRED'
  | 'SESSION_REVOKED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'INVITE_SENT'
  | 'INVITE_ACCEPTED'
  | 'ROLE_CHANGED'
  | 'PERMISSION_CHANGED'
  | 'SUSPICIOUS_ACTIVITY';

/**
 * Granular permission with conditions
 *
export interface IPermission {
  resource: ResourceType;
  actions: ActionType[];
  conditions?: {
    maxValue?: number;           // Max order value for approval
    ownRecordsOnly?: boolean;    // Restrict to creator's records
    department?: string;         // Department restriction
    requiresApproval?: boolean;  // Needs secondary approval
    timeWindow?: string;         // Business hours only
  };
}

/**
 * Active session tracking
 
export interface ISession {
  token: string;                 // JWT or session identifier
  refreshToken: string;          // Long-lived refresh token
  device: string;                // "Chrome-Windows-Desk1"
  deviceFingerprint: string;     // Hashed device signature
  ipAddress: string;
  location?: string;             // GeoIP city/country
  userAgent: string;
  startedAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
  isActive: boolean;
  isTrusted: boolean;            // Remember this device?
}

/**
 * Login history entry
 *
export interface ILoginHistory {
  timestamp: Date;
  ipAddress: string;
  device: string;
  location?: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;        // "wrong_password", "account_locked", etc.
  method: LoginMethod;
  sessionId?: string;
}

/**
 * Security controls and 2FA
 *
export interface ISecuritySettings {
  failedLoginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;      // Encrypted TOTP secret
  twoFactorBackupCodes?: string[]; // Hashed backup codes
  lastPasswordReset: Date;
  mustChangePassword: boolean;
  passwordHistory: string[];     // Last 5 password hashes
  trustedDevices: Array<{
    fingerprint: string;
    name: string;
    addedAt: Date;
    lastUsed: Date;
  }>;
}

/**
 * User document interface
 *
export interface IUser extends Document, IUserMethods {
  // --- Identity ---
  staff: Types.ObjectId;         // Links to Staff record
  employeeId: string;            // Same as Staff.employeeId for login
  
  // --- Contact ---
  email: string;                 // Work email
  phone: string;                 // For SMS login/2FA
  
  // --- Authentication ---
  passwordHash: string;
  pinHash?: string;              // Optional 4-digit PIN for fast floor login
  passwordChangedAt: Date;
  
  // --- Authorization ---
  role: SystemRole;
  roleLevel: RoleLevel;
  permissions: IPermission[];
  customPermissions: IPermission[]; // Overrides/additions to base role
  
  // --- Session Management ---
  sessions: ISession[];
  loginHistory: ILoginHistory[];
  
  // --- Status ---
  status: UserStatus;
  
  // --- Security ---
  security: ISecuritySettings;
  
  // --- Audit ---
  invitedBy: Types.ObjectId;     // Who created this user
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;              // Soft delete

  isLocked: boolean;
  isPasswordExpired: boolean;
  daysToPasswordExpiry: number;
  activeSessionCount: number;
  
  // --- Methods ---
  comparePassword(candidatePassword: string): Promise<boolean>;
  comparePin(candidatePin: string): Promise<boolean>;
  hasPermission(resource: ResourceType, action: ActionType, context?: any): boolean;
  recordLoginAttempt(success: boolean, details: any): Promise<void>;
  createSession(deviceInfo: any): Promise<ISession>;
  revokeSession(sessionId: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  lockAccount(durationMinutes: number): void;
  unlockAccount(): void;
  generatePasswordResetToken(): string;
}

/**
 * Invitation tracking
 *
export interface IInvitation extends Document {
  invitedBy: Types.ObjectId;     // Admin who sent invitation
  staff: Types.ObjectId;         // Pre-created staff record
  email: string;
  phone: string;
  
  token: string;                 // Secure random token
  expiresAt: Date;               // 48 hours default
  
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  acceptedAt?: Date;
  acceptedByDevice?: string;
  
  // Security tracking
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Security audit log
 *
export interface ISecurityLog extends Document {
  timestamp: Date;
  user: Types.ObjectId;
  action: SecurityAction;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  
  details: {
    ipAddress: string;
    device?: string;
    location?: string;
    userAgent?: string;
    success: boolean;
    reason?: string;
    metadata?: any;
  };
  
  sessionId?: string;
  resource?: ResourceType;
  actionAttempted?: ActionType;
  
  acknowledged: boolean;
  acknowledgedBy?: Types.ObjectId;
  acknowledgedAt?: Date;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PermissionSchema = new Schema<IPermission>({
  resource: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'QUOTATION', 'PRICE', 'PRODUCT', 'STOCK', 'PACKING', 'DELIVERY', 'CLIENT', 'STAFF', 'REPORT', 'DASHBOARD', 'SETTINGS', 'SYSTEM'],
    required: true
  },
  actions: [{
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'],
    required: true
  }],
  conditions: {
    maxValue: Number,
    ownRecordsOnly: Boolean,
    department: String,
    requiresApproval: Boolean,
    timeWindow: String
  }
}, { _id: true });

const SessionSchema = new Schema<ISession>({
  token: {
    type: String,
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  deviceFingerprint: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  location: String,
  userAgent: String,
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTrusted: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const LoginHistorySchema = new Schema<ILoginHistory>({
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  device: String,
  location: String,
  userAgent: String,
  success: {
    type: Boolean,
    required: true
  },
  failureReason: String,
  method: {
    type: String,
    enum: ['PASSWORD', 'SMS', 'EMAIL_LINK', 'PIN', 'RFID', 'BIOMETRIC'],
    default: 'PASSWORD'
  },
  sessionId: String
}, { _id: true });

const SecuritySettingsSchema = new Schema<ISecuritySettings>({
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
  lastPasswordReset: {
    type: Date,
    default: Date.now
  },
  mustChangePassword: {
    type: Boolean,
    default: true
  },
  passwordHistory: [String],
  trustedDevices: [{
    fingerprint: String,
    name: String,
    addedAt: Date,
    lastUsed: Date
  }]
}, { _id: false });

// ----------------------------------------------------------------------------
// USER SCHEMA
// ----------------------------------------------------------------------------

const UserSchema = new Schema<IUser>({
  // --- Identity ---
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    unique: true,
    index: true
  },
  
  employeeId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    uppercase: true
  },
  
  // --- Contact ---
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // --- Authentication ---
  passwordHash: {
    type: String,
    required: true
  },
  
  pinHash: String,  // Optional for fast floor login
  
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  
  // --- Authorization ---
  role: {
    type: String,
    enum: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'STAFF', 'READONLY'],
    required: true,
    default: 'STAFF',
    index: true
  },
  
  roleLevel: {
    type: Number,
    enum: [4, 3, 2, 1, 0],
    required: true,
    default: 1
  },
  
  permissions: [PermissionSchema],
  
  customPermissions: [PermissionSchema],
  
  // --- Session Management ---
  sessions: [SessionSchema],
  
  loginHistory: {
    type: [LoginHistorySchema],
    default: []
  },
  
  // --- Status ---
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'LOCKED', 'INACTIVE'],
    default: 'PENDING',
    index: true
  },
  
  // --- Security ---
  security: {
    type: SecuritySettingsSchema,
    default: () => ({})
  },
  
  // --- Audit ---
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  lastLoginAt: Date,
  
  deletedAt: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INVITATION SCHEMA
// ----------------------------------------------------------------------------

const InvitationSchema = new Schema<IInvitation>({
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    unique: true
  },
  
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: true
  },
  
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
  },
  
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'],
    default: 'PENDING',
    index: true
  },
  
  acceptedAt: Date,
  acceptedByDevice: String,
  
  ipAddress: String,
  userAgent: String

}, {
  timestamps: true
});

// ----------------------------------------------------------------------------
// SECURITY LOG SCHEMA
// ----------------------------------------------------------------------------

const SecurityLogSchema = new Schema<ISecurityLog>({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  action: {
    type: String,
    enum: [
      'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'PASSWORD_RESET',
      'PERMISSION_DENIED', 'SESSION_EXPIRED', 'SESSION_REVOKED',
      'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'INVITE_SENT', 'INVITE_ACCEPTED',
      'ROLE_CHANGED', 'PERMISSION_CHANGED', 'SUSPICIOUS_ACTIVITY'
    ],
    required: true,
    index: true
  },
  
  severity: {
    type: String,
    enum: ['INFO', 'WARNING', 'CRITICAL'],
    required: true,
    default: 'INFO',
    index: true
  },
  
  details: {
    ipAddress: {
      type: String,
      required: true
    },
    device: String,
    location: String,
    userAgent: String,
    success: {
      type: Boolean,
      required: true
    },
    reason: String,
    metadata: Schema.Types.Mixed
  },
  
  sessionId: String,
  resource: String,
  actionAttempted: String,
  
  acknowledged: {
    type: Boolean,
    default: false
  },
  
  acknowledgedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  acknowledgedAt: Date

}, {
  timestamps: true
});

SecurityLogSchema.index({ user: 1, timestamp: -1 });
SecurityLogSchema.index({ action: 1, severity: 1, timestamp: -1 });

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ status: 1, role: 1 });
UserSchema.index({ 'sessions.token': 1 });
UserSchema.index({ 'sessions.refreshToken': 1 });

InvitationSchema.index({ token: 1, status: 1 });
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

/**
 * Check if account is currently locked
 *
UserSchema.virtual('isLocked').get(function(this: IUser) {
  if (this.security.lockedUntil && this.security.lockedUntil > new Date()) {
    return true;
  }
  return false;
});

/**
 * Check if password is expired (90 days)
 *
UserSchema.virtual('isPasswordExpired').get(function(this: IUser) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return this.passwordChangedAt < ninetyDaysAgo;
});

/**
 * Days until password expires
 *
UserSchema.virtual('daysToPasswordExpiry').get(function(this: IUser) {
  const expiryDate = new Date(this.passwordChangedAt.getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
});

/**
 * Active session count
 *
UserSchema.virtual('activeSessionCount').get(function(this: IUser) {
  return this.sessions.filter(s => s.isActive && s.expiresAt > new Date()).length;
});

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Hash password if modified
 *
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return ;
  
  // Validate password strength
  if (this.isNew || this.isModified('passwordHash')) {
    // Password strength check would go here
  }
  
});

/**
 * Pre-save: Set role level based on role
 *
UserSchema.pre('save', function(next) {
  const roleLevels: Record<SystemRole, RoleLevel> = {
    'ADMIN': 4,
    'MANAGER': 3,
    'SUPERVISOR': 2,
    'STAFF': 1,
    'READONLY': 0
  };
  
  this.roleLevel = roleLevels[this.role];
  
  // Auto-populate base permissions based on role
  if (this.isNew || this.isModified('role')) {
    this.permissions = getBasePermissions(this.role);
  }
  

});

/**
 * Pre-save: Ensure only one active session for STAFF role (optional restriction)
 *
UserSchema.pre('save', async function(next) {
  if (this.isModified('sessions') && this.role === 'STAFF') {
    const activeSessions = this.sessions.filter(s => s.isActive);
    if (activeSessions.length > 2) {
      // Revoke oldest sessions
      const sorted = activeSessions.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
      for (let i = 0; i < sorted.length - 2; i++) {
        const session = this.sessions.find(s => s.token === sorted[i].token);
        if (session) session.isActive = false;
      }
    }
  }

});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

/**
 * Compare password with hash
 *
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Compare PIN with hash
 *
UserSchema.methods.comparePin = async function(candidatePin: string): Promise<boolean> {
  if (!this.pinHash) return false;
  return bcrypt.compare(candidatePin, this.pinHash);
};

/**
 * Check if user has specific permission
 *
UserSchema.methods.hasPermission = function(
  resource: ResourceType, 
  action: ActionType, 
  context?: { value?: number; isOwner?: boolean; department?: string }
): boolean {
  // Admin has all permissions
  if (this.role === 'ADMIN') return true;
  
  // Check suspended/locked
  if (this.status !== 'ACTIVE') return false;
  
  // Combine base and custom permissions
  const allPermissions = [...this.permissions, ...this.customPermissions];
  
  // Find matching permission
  const permission = allPermissions.find(p => p.resource === resource);
  if (!permission) return false;
  
  // Check action
  if (!permission.actions.includes(action) && !permission.actions.includes('ADMIN')) {
    return false;
  }
  
  // Check conditions
  if (permission.conditions) {
    // Max value check (for approvals)
    if (permission.conditions.maxValue !== undefined && context?.value) {
      if (context.value > permission.conditions.maxValue) {
        return false;
      }
    }
    
    // Own records only
    if (permission.conditions.ownRecordsOnly && !context?.isOwner) {
      return false;
    }
    
    // Department restriction
    if (permission.conditions.department && context?.department !== permission.conditions.department) {
      return false;
    }
  }
  
  return true;
};

/**
 * Record login attempt
 *
UserSchema.methods.recordLoginAttempt = async function(
  success: boolean, 
  details: { ipAddress: string; device: string; userAgent: string; method: LoginMethod; reason?: string }
): Promise<void> {
  // Add to history
  this.loginHistory.push({
    timestamp: new Date(),
    ipAddress: details.ipAddress,
    device: details.device,
    userAgent: details.userAgent,
    success,
    failureReason: details.reason,
    method: details.method
  });
  
  // Trim history to last 50 entries
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  
  if (success) {
    // Reset failed attempts
    this.security.failedLoginAttempts = 0;
    this.lastLoginAt = new Date();
    this.status = this.status === 'LOCKED' ? 'ACTIVE' : this.status;
  } else {
    // Increment failed attempts
    this.security.failedLoginAttempts += 1;
    
    // Lock account after 5 failures
    if (this.security.failedLoginAttempts >= 5) {
      this.lockAccount(30); // 30 minutes
    }
  }
  
  await this.save();
};

/**
 * Create new session
 *
UserSchema.methods.createSession = async function(
  deviceInfo: { device: string; ipAddress: string; userAgent: string; fingerprint: string; isTrusted?: boolean }
): Promise<ISession> {
  // Check session limits based on role
  const maxSessions = {
    'ADMIN': Infinity,
    'MANAGER': 3,
    'SUPERVISOR': 2,
    'STAFF': 2,
    'READONLY': 1
  };
  
  const activeSessions = this.sessions.filter((s: { isActive: any; }) => s.isActive);
  if (activeSessions.length >= maxSessions[this.role as SystemRole]) {
  //if (activeSessions.length >= maxSessions[this.role]) {
    // Revoke oldest session
    const oldest = activeSessions.sort((a: { lastActiveAt: { getTime: () => number; }; }, b: { lastActiveAt: { getTime: () => number; }; }) => a.lastActiveAt.getTime() - b.lastActiveAt.getTime())[0];
    const sessionToRevoke = this.sessions.find((s: { token: any; }) => s.token === oldest.token);
    if (sessionToRevoke) {
      sessionToRevoke.isActive = false;
    }
  }
  
  // Generate tokens
  const token = crypto.randomBytes(32).toString('hex');
  const refreshToken = crypto.randomBytes(32).toString('hex');
  
  const session: ISession = {
    token,
    refreshToken,
    device: deviceInfo.device,
    deviceFingerprint: deviceInfo.fingerprint,
    ipAddress: deviceInfo.ipAddress,
    userAgent: deviceInfo.userAgent,
    startedAt: new Date(),
    lastActiveAt: new Date(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    isActive: true,
    isTrusted: deviceInfo.isTrusted || false
  };
  
  this.sessions.push(session);
  await this.save();
  
  return session;
};

/**
 * Revoke specific session
 *
UserSchema.methods.revokeSession = async function(sessionId: string): Promise<void> {
  const session = this.sessions.find((s: { token: string; refreshToken: string; }) => s.token === sessionId || s.refreshToken === sessionId);
  if (session) {
    session.isActive = false;
    await this.save();
  }
};

/**
 * Revoke all other sessions
 *
UserSchema.methods.revokeOtherSessions = async function(currentSessionId: string): Promise<void> {
  this.sessions.forEach((session: { token: string; refreshToken: string; isActive: boolean; }) => {
    if (session.token !== currentSessionId && session.refreshToken !== currentSessionId) {
      session.isActive = false;
    }
  });
  await this.save();
};

/**
 * Change password with validation
 *
UserSchema.methods.changePassword = async function(newPassword: string): Promise<void> {
  // Check password history
  for (const oldHash of this.security.passwordHistory) {
    if (await bcrypt.compare(newPassword, oldHash)) {
      throw new Error('Cannot reuse recent passwords');
    }
  }
  
  // Hash new password
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(newPassword, salt);
  this.passwordChangedAt = new Date();
  this.security.lastPasswordReset = new Date();
  this.security.mustChangePassword = false;
  
  // Update password history
  this.security.passwordHistory.unshift(this.passwordHash);
  if (this.security.passwordHistory.length > 5) {
    this.security.passwordHistory.pop();
  }
  
  // Revoke all sessions except current
  this.sessions.forEach((s: { isActive: boolean; }) => s.isActive = false);
  
  await this.save();
};

/**
 * Lock account
 *
UserSchema.methods.lockAccount = function(durationMinutes: number): void {
  this.security.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  this.status = 'LOCKED';
};

/**
 * Unlock account
 *
UserSchema.methods.unlockAccount = function(): void {
  this.security.lockedUntil = undefined;
  this.security.failedLoginAttempts = 0;
  this.status = 'ACTIVE';
};

/**
 * Generate password reset token
 *
UserSchema.methods.generatePasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Store hashed version temporarily (would need a separate field or use a cache)
  // For now, we'll use a virtual or separate collection
  
  return resetToken;
};

/**
 * Get public profile (safe to send to client)
 *
UserSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    staff: this.staff,
    employeeId: this.employeeId,
    email: this.email,
    role: this.role,
    roleLevel: this.roleLevel,
    status: this.status,
    permissions: this.permissions,
    mustChangePassword: this.security.mustChangePassword,
    twoFactorEnabled: this.security.twoFactorEnabled
  };
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Find by credentials (login)
 *
UserSchema.statics.findByCredentials = async function(
  employeeId: string, 
  password: string
): Promise<IUser | null> {
  const user = await this.findOne({ 
    employeeId: employeeId.toUpperCase(),
    status: { $in: ['ACTIVE', 'LOCKED', 'PENDING'] }
  });
  
  if (!user) return null;
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return null;
  
  return user;
};

/**
 * Find by refresh token
 *
UserSchema.statics.findByRefreshToken = async function(token: string): Promise<IUser | null> {
  return this.findOne({
    'sessions.refreshToken': token,
    'sessions.isActive': true,
    'sessions.expiresAt': { $gt: new Date() }
  });
};

/**
 * Get base permissions for role
 *
function getBasePermissions(role: SystemRole): IPermission[] {
  const basePermissions: Record<SystemRole, IPermission[]> = {
    'ADMIN': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] },
      { resource: 'PRODUCT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'STOCK', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'STAFF', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'REPORT', actions: ['READ', 'EXPORT', 'ADMIN'] },
      { resource: 'DASHBOARD', actions: ['READ', 'UPDATE', 'ADMIN'] },
      { resource: 'SETTINGS', actions: ['READ', 'UPDATE', 'ADMIN'] },
      { resource: 'SYSTEM', actions: ['ADMIN'] }
    ],
    'MANAGER': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE', 'EXPORT'], conditions: { maxValue: 500000 } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE', 'EXPORT'] },
      { resource: 'QUOTATION', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE', 'EXPORT'] },
      { resource: 'PRICE', actions: ['READ', 'UPDATE'] },
      { resource: 'PRODUCT', actions: ['READ', 'UPDATE'] },
      { resource: 'STOCK', actions: ['READ', 'UPDATE'] },
      { resource: 'PACKING', actions: ['READ', 'UPDATE', 'ADMIN'] },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'STAFF', actions: ['READ', 'UPDATE'] },
      { resource: 'REPORT', actions: ['READ', 'EXPORT'] },
      { resource: 'DASHBOARD', actions: ['READ'] }
    ],
    'SUPERVISOR': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE'], conditions: { maxValue: 100000, ownRecordsOnly: false } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'QUOTATION', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'PRICE', actions: ['READ', 'UPDATE'], conditions: { maxValue: 50000 } },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'PACKING', actions: ['READ', 'UPDATE'] },
      { resource: 'REPORT', actions: ['READ'] },
      { resource: 'DASHBOARD', actions: ['READ'] }
    ],
    'STAFF': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE'], conditions: { maxValue: 50000, ownRecordsOnly: true } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ'], conditions: { ownRecordsOnly: true } },
      { resource: 'QUOTATION', actions: ['CREATE', 'READ'], conditions: { ownRecordsOnly: true } },
      { resource: 'PRICE', actions: ['READ'] },
      { resource: 'PACKING', actions: ['READ', 'UPDATE'], conditions: { ownRecordsOnly: true } },
      { resource: 'CLIENT', actions: ['READ', 'CREATE'] },
      { resource: 'DASHBOARD', actions: ['READ'] }
    ],
    'READONLY': [
      { resource: 'ORDER', actions: ['READ'] },
      { resource: 'INVOICE', actions: ['READ'] },
      { resource: 'CLIENT', actions: ['READ'] },
      { resource: 'REPORT', actions: ['READ'] }
    ]
  };
  
  return basePermissions[role] || [];
}

/**
 * Create invitation
 *
UserSchema.statics.createInvitation = async function(
  invitedBy: Types.ObjectId,
  staffId: Types.ObjectId,
  email: string,
  phone: string
): Promise<IInvitation> {
  const Invitation = mongoose.model<IInvitation>('Invitation');
  
  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  
  const invitation = new Invitation({
    invitedBy,
    staff: staffId,
    email,
    phone,
    token,
    status: 'PENDING'
  });
  
  await invitation.save();
  return invitation;
};

/**
 * Get security stats for dashboard
 *
UserSchema.statics.getSecurityStats = async function(): Promise<{
  totalUsers: number;
  activeNow: number;
  lockedAccounts: number;
  pendingInvitations: number;
  failedLoginsToday: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [totalUsers, activeNow, lockedAccounts, pendingInvitations] = await Promise.all([
    this.countDocuments({ deletedAt: { $exists: false } }),
    this.countDocuments({ 
      'sessions.isActive': true, 
      'sessions.expiresAt': { $gt: new Date() } 
    }),
    this.countDocuments({ status: 'LOCKED' }),
    mongoose.model('Invitation').countDocuments({ status: 'PENDING' })
  ]);
  
  // Failed logins would need aggregation on loginHistory
  const failedLoginsToday = 0; // Simplified
  
  return {
    totalUsers,
    activeNow,
    lockedAccounts,
    pendingInvitations,
    failedLoginsToday
  };
};

// ----------------------------------------------------------------------------
// INVITATION METHODS
// ----------------------------------------------------------------------------

/**
 * Accept invitation
 *
InvitationSchema.methods.accept = async function(
  ipAddress: string, 
  userAgent: string
): Promise<void> {
  this.status = 'ACCEPTED';
  this.acceptedAt = new Date();
  this.ipAddress = ipAddress;
  this.userAgent = userAgent;
  await this.save();
};

/**
 * Revoke invitation
 *
InvitationSchema.methods.revoke = async function(): Promise<void> {
  this.status = 'REVOKED';
  await this.save();
};

/**
 * Check if expired
 *
InvitationSchema.methods.isExpired = function(): boolean {
  return this.expiresAt < new Date();
};

// ----------------------------------------------------------------------------
// MODEL EXPORTS
// ----------------------------------------------------------------------------

export const User = mongoose.model<IUser>('User', UserSchema);
export const Invitation = mongoose.model<IInvitation>('Invitation', InvitationSchema);
export const SecurityLog = mongoose.model<ISecurityLog>('SecurityLog', SecurityLogSchema);

export default { User, Invitation, SecurityLog };

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * STAFF CREATION WORKFLOW:
 * 
 * // 1. Admin creates staff record
 * const staff = await Staff.create({
 *   employeeId: 'EMP-005',
 *   firstName: 'Alice',
 *   lastName: 'Wanjiku',
 *   role: 'JACKY',
 *   email: 'alice@malex.co.ke',
 *   phone: '+254712345999'
 * });
 * 
 * // 2. System auto-creates invitation
 * const invitation = await User.createInvitation(
 *   adminUser._id,
 *   staff._id,
 *   staff.email,
 *   staff.phone
 * );
 * 
 * // 3. Send invitation SMS/email
 * await sendInvitationSMS(staff.phone, invitation.token);
 * 
 * // 4. Staff clicks link / enters token
 * // POST /auth/register
 * {
 *   token: 'abc123...',
 *   employeeId: 'EMP-005',
 *   password: 'SecurePass123!',
 *   confirmPassword: 'SecurePass123!'
 * }
 * 
 * // 5. System creates user
 * const user = new User({
 *   staff: staff._id,
 *   employeeId: staff.employeeId,
 *   email: staff.email,
 *   phone: staff.phone,
 *   passwordHash: await bcrypt.hash(password, 12),
 *   role: 'SUPERVISOR',  // Based on staff.role mapping
 *   status: 'ACTIVE',
 *   invitedBy: adminUser._id,
 *   security: {
 *     lastPasswordReset: new Date(),
 *     mustChangePassword: false
 *   }
 * });
 * 
 * // 6. Log security event
 * await SecurityLog.create({
 *   user: user._id,
 *   action: 'INVITE_ACCEPTED',
 *   severity: 'INFO',
 *   details: {
 *     ipAddress: req.ip,
 *     device: 'Chrome-Windows',
 *     success: true
 *   }
 * });
 */

/**
 * LOGIN WORKFLOW:
 * 
 * // POST /auth/login
 * const { employeeId, password, deviceId } = req.body;
 * 
 * // Find user
 * const user = await User.findByCredentials(employeeId, password);
 * if (!user) {
 *   await SecurityLog.create({
 *     user: null,
 *     action: 'LOGIN_FAILED',
 *     severity: 'WARNING',
 *     details: { ipAddress: req.ip, reason: 'invalid_credentials', success: false }
 *   });
 *   return res.status(401).json({ error: 'Invalid credentials' });
 * }
 * 
 * // Check account status
 * if (user.status === 'LOCKED') {
 *   if (user.isLocked) {
 *     return res.status(423).json({ 
 *       error: 'Account locked', 
 *       lockedUntil: user.security.lockedUntil 
 *     });
 *   } else {
 *     user.unlockAccount();
 *   }
 * }
 * 
 * if (user.status !== 'ACTIVE') {
 *   return res.status(403).json({ error: 'Account not active' });
 * }
 * 
 * // Check password expiry
 * if (user.isPasswordExpired) {
 *   user.security.mustChangePassword = true;
 *   await user.save();
 * }
 * 
 * // Create session
 * const session = await user.createSession({
 *   device: deviceId || 'Unknown Device',
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 *   fingerprint: generateDeviceFingerprint(req),
 *   isTrusted: false
 * });
 * 
 * // Record successful login
 * await user.recordLoginAttempt(true, {
 *   ipAddress: req.ip,
 *   device: deviceId,
 *   userAgent: req.headers['user-agent'],
 *   method: 'PASSWORD'
 * });
 * 
 * // Log to Time Management
 * await TimeRecord.startTask(
 *   user.staff,
 *   'SHIFT_START',
 *   { module: 'SYSTEM', entityId: user._id, entityNumber: user.employeeId },
 *   'Shift started - Login',
 *   { deviceId: deviceId || 'SYSTEM', type: 'DESKTOP' }
 * );
 * 
 * // Return tokens
 * res.json({
 *   success: true,
 *   token: session.token,
 *   refreshToken: session.refreshToken,
 *   expiresIn: 28800,
 *   user: user.getPublicProfile()
 * });
 */

/**
 * PERMISSION CHECK IN API:
 * 
 * // Middleware
 * function requirePermission(resource: ResourceType, action: ActionType) {
 *   return async (req, res, next) => {
 *     const user = await User.findById(req.userId);
 *     
 *     const context = {
 *       value: req.body.total || 0,
 *       isOwner: req.body.createdBy === req.userId,
 *       department: req.user.department
 *     };
 *     
 *     if (!user.hasPermission(resource, action, context)) {
 *       await SecurityLog.create({
 *         user: user._id,
 *         action: 'PERMISSION_DENIED',
 *         severity: 'WARNING',
 *         details: {
 *           resource,
 *           actionAttempted: action,
 *           context,
 *           ipAddress: req.ip,
 *           success: false
 *         }
 *       });
 *       
 *       return res.status(403).json({ 
 *         error: 'Permission denied',
 *         required: `${resource}.${action}`,
 *         yourRole: user.role
 *       });
 *     }
 *     
 *     next();
 *   };
 * }
 * 
 * // Usage
 * app.post('/api/orders', 
 *   authenticate,
 *   requirePermission('ORDER', 'CREATE'),
 *   createOrder
 * );
 * 
 * app.post('/api/orders/:id/approve',
 *   authenticate,
 *   requirePermission('ORDER', 'APPROVE'),
 *   approveOrder
 * );
 */

/**
 * AUTO-LOGOUT ON INACTIVITY:
 * 
 * // Cron job every 5 minutes
 * const inactiveUsers = await User.find({
 *   'sessions.isActive': true,
 *   'sessions.lastActiveAt': { 
 *     $lt: new Date(Date.now() - 30 * 60 * 1000) // 30 min
 *   },
 *   role: 'STAFF'
 * });
 * 
 * for (const user of inactiveUsers) {
 *   for (const session of user.sessions) {
 *     if (session.isActive && session.lastActiveAt < new Date(Date.now() - 30 * 60 * 1000)) {
 *       session.isActive = false;
 *       
 *       await SecurityLog.create({
 *         user: user._id,
 *         action: 'SESSION_EXPIRED',
 *         severity: 'INFO',
 *         details: {
 *           sessionId: session.token,
 *           reason: 'inactivity_timeout',
 *           ipAddress: session.ipAddress,
 *           success: true
 *         }
 *       });
 *       
 *       // Update TimeRecord
 *       await TimeRecord.completeTask(
 *         user.staff,
 *         session.token, // Using session as entity for tracking
 *         'ESCAPED',
 *         'Auto-logout due to inactivity'
 *       );
 *     }
 *   }
 *   await user.save();
 * }
 */

/**
 * SUSPICIOUS ACTIVITY DETECTION:
 * 
 * // After failed login
 * if (user.security.failedLoginAttempts === 3) {
 *   await sendAlertToAdmin(user, 'Multiple failed login attempts');
 * }
 * 
 * // Check for impossible travel (login from different countries within hours)
 * const recentLogins = user.loginHistory
 *   .filter(l => l.success)
 *   .slice(-5);
 * 
 * if (recentLogins.length >= 2) {
 *   const lastLocation = recentLogins[recentLogins.length - 1].location;
 *   const previousLocation = recentLogins[recentLogins.length - 2].location;
 *   
 *   if (lastLocation && previousLocation && lastLocation !== previousLocation) {
 *     await SecurityLog.create({
 *       user: user._id,
 *       action: 'SUSPICIOUS_ACTIVITY',
 *       severity: 'CRITICAL',
 *       details: {
 *         type: 'impossible_travel',
 *         locations: [previousLocation, lastLocation],
 *         ipAddress: req.ip,
 *         success: true
 *       }
 *     });
 *     
 *     // Force 2FA or lock account
 *     user.lockAccount(60);
 *     await user.save();
 *   }
 * }
 */





// ============================================================================
// AUTHENTICATION & AUTHORIZATION MODULE (Refactored)
// ============================================================================
// Core Purpose: Universal identity system supporting both Clients and Staff
// Architecture: Polymorphic User with profile-specific extensions
// Interconnections:
//   - Links to Staff module (operations profile) - OPTIONAL
//   - Links to Client module (business profile) - OPTIONAL  
//   - Triggers Time Management (login/logout tracking)
//   - Feeds Dashboard (active sessions, security alerts)
//   - Logs to Messaging (security notifications)
//   - Provides permissions to all API endpoints
// ============================================================================

import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * Account classification
 * CLIENT: Can place orders, view own history
 * STAFF: Can access operational modules based on role
 * BOTH: Employee who is also a client (rare but supported)
 * ADMIN: System administrator (always STAFF equivalent)
 */
export type AccountType = 'CLIENT' | 'STAFF' | 'BOTH' | 'ADMIN';

/**
 * System roles mapped to team hierarchy
 * CLIENT: Special role with limited self-service permissions
 */
export type SystemRole = 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'STAFF' | 'READONLY' | 'CLIENT';

/**
 * Role levels for hierarchy checks
 */
export type RoleLevel = 4 | 3 | 2 | 1 | 0;

/**
 * How the account was created
 */
export type AccountCreationMethod = 'SELF_REGISTRATION' | 'STAFF_INVITE' | 'ADMIN_CREATION' | 'SYSTEM' | 'CLIENT_UPGRADE';

/**
 * Resources that can be accessed
 */
export type ResourceType = 
  | 'ORDER' 
  | 'INVOICE' 
  | 'QUOTATION' 
  | 'PRICE' 
  | 'PRODUCT' 
  | 'STOCK' 
  | 'PACKING' 
  | 'DELIVERY'
  | 'CLIENT' 
  | 'STAFF' 
  | 'REPORT' 
  | 'DASHBOARD' 
  | 'SETTINGS' 
  | 'SYSTEM'
  | 'OWN_PROFILE';  // Special resource for clients

/**
 * Actions that can be performed on resources
 */
export type ActionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT' | 'ADMIN' | 'MANAGE';

/**
 * User account status
 */
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'INACTIVE';

/**
 * Login methods
 */
export type LoginMethod = 'PASSWORD' | 'SMS' | 'EMAIL_LINK' | 'PIN' | 'RFID' | 'BIOMETRIC';

/**
 * Security action types for audit log
 */
export type SecurityAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'LOGIN_FAILED' 
  | 'PASSWORD_CHANGE' 
  | 'PASSWORD_RESET'
  | 'PERMISSION_DENIED' 
  | 'SESSION_EXPIRED'
  | 'SESSION_REVOKED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'INVITE_SENT'
  | 'INVITE_ACCEPTED'
  | 'ROLE_CHANGED'
  | 'PERMISSION_CHANGED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'CLIENT_REGISTERED'
  | 'STAFF_PROFILE_ACTIVATED'
  | 'SESSION_VALIDATION_FAILED';

/**
 * Granular permission with conditions
 */
export interface IPermission {
  resource: ResourceType;
  actions: ActionType[];
  conditions?: {
    maxValue?: number;           // Max order value for approval
    ownRecordsOnly?: boolean;    // Restrict to creator's records
    department?: string;         // Department restriction
    requiresApproval?: boolean;  // Needs secondary approval
    timeWindow?: string;         // Business hours only
    ownClientId?: Types.ObjectId; // For client-specific resource access
  };
}

/**
 * Active session tracking
 */
export interface ISession {
  token: string;                 // JWT or session identifier
  refreshToken: string;          // Long-lived refresh token
  device: string;                // "Chrome-Windows-Desk1"
  deviceFingerprint: string;     // Hashed device signature
  ipAddress: string;
  location?: string;             // GeoIP city/country
  userAgent: string;
  startedAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
  isActive: boolean;
  isTrusted: boolean;            // Remember this device?
  context?: 'CLIENT_PORTAL' | 'STAFF_DESKTOP' | 'ADMIN_PANEL'; // Where logged in
}

/**
 * Login history entry
 */
export interface ILoginHistory {
  timestamp: Date;
  ipAddress: string;
  device: string;
  location?: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;        // "wrong_password", "account_locked", etc.
  method: LoginMethod;
  sessionId?: string;
}

/**
 * Security controls and 2FA
 */
export interface ISecuritySettings {
  failedLoginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;      // Encrypted TOTP secret
  twoFactorBackupCodes?: string[]; // Hashed backup codes
  lastPasswordReset: Date;
  mustChangePassword: boolean;
  passwordHistory: string[];     // Last 5 password hashes
  trustedDevices: Array<{
    fingerprint: string;
    name: string;
    addedAt: Date;
    lastUsed: Date;
  }>;
}

/**
 * User document interface - Refactored for dual identity
 */
export interface IUser extends Document {
  // --- Identity (Universal) ---
  email: string;                 // Universal login identifier
  phone: string;                 // Backup identifier, 2FA
  
  // --- Profile Links (Polymorphic) ---
  // At least ONE must be set (enforced in middleware)
  clientProfile?: Types.ObjectId;  // Link to Client collection (for CLIENT/BOTH)
  staffProfile?: Types.ObjectId;   // Link to Staff collection (for STAFF/BOTH/ADMIN)
  
  // --- Classification ---
  accountType: AccountType;      // CLIENT | STAFF | BOTH | ADMIN
  role: SystemRole;              // CLIENT for clients, others for staff
  
  // --- Staff-specific fields (required if accountType != CLIENT) ---
  employeeId?: string;           // EMP-XXX format (undefined for pure clients)
  roleLevel: RoleLevel;          // Hierarchy level (0 for clients)
  permissions: IPermission[];    // Empty for clients, populated for staff
  customPermissions: IPermission[]; // Additional grants
  
  // --- Authentication ---
  passwordHash: string;
  pinHash?: string;              // Optional 4-digit PIN
  passwordChangedAt: Date;
  
  // --- Session Management ---
  sessions: ISession[];
  loginHistory: ILoginHistory[];
  
  // --- Status ---
  status: UserStatus;
  
  // --- Security ---
  security: ISecuritySettings;
  
  // --- Audit ---
  invitedBy?: Types.ObjectId;    // Optional for self-registered clients
  createdVia: AccountCreationMethod;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;              // Soft delete

  // --- Virtuals ---
  isLocked: boolean;
  isPasswordExpired: boolean;
  daysToPasswordExpiry: number;
  activeSessionCount: number;
  isClient: boolean;
  isStaff: boolean;
  
  // --- Methods ---
  comparePassword(candidatePassword: string): Promise<boolean>;
  comparePin(candidatePin: string): Promise<boolean>;
  hasPermission(resource: ResourceType, action: ActionType, context?: any): boolean;
  canAccessModule(moduleName: string): boolean;
  recordLoginAttempt(success: boolean, details: any): Promise<void>;
  createSession(deviceInfo: any, context?: 'CLIENT_PORTAL' | 'STAFF_DESKTOP' | 'ADMIN_PANEL'): Promise<ISession>;
  revokeSession(sessionId: string): Promise<void>;
  revokeOtherSessions(currentSessionId: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  lockAccount(durationMinutes: number): void;
  unlockAccount(): void;
  generatePasswordResetToken(): string;
  getPublicProfile(): any;
  upgradeToStaff(staffId: Types.ObjectId, role: SystemRole, invitedBy: Types.ObjectId): Promise<void>;
}

/**
 * Enhanced Invitation tracking
 * Supports: New staff invites, Client->Staff upgrades, Client referrals
 */
export interface IInvitation extends Document {
  invitedBy: Types.ObjectId;           // Admin who sent invitation
  
  // Target identification (one of these must be set)
  targetEmail?: string;                // For external invites
  targetPhone?: string;                // For SMS invites  
  existingUserId?: Types.ObjectId;     // For promoting existing client to staff
  
  // Invitation classification
  invitationType: 'STAFF_ONBOARDING' | 'CLIENT_REGISTRATION' | 'ROLE_UPGRADE' | 'ADMIN_INVITE';
  targetRole: SystemRole;              // What role they'll get (STAFF, MANAGER, etc.)
  
  // Pre-created records (for tracking)
  pendingStaffRecord?: Types.ObjectId; // Pre-created Staff doc (status: PENDING)
  targetClientId?: Types.ObjectId;     // If inviting a specific client to upgrade
  
  token: string;                       // Secure random token
  expiresAt: Date;                     // 48 hours default
  
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  acceptedAt?: Date;
  acceptedByUser?: Types.ObjectId;     // Link to User who accepted
  
  // Security tracking
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Security audit log
 */
export interface ISecurityLog extends Document {
  timestamp: Date;
  user: Types.ObjectId;
  action: SecurityAction;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  
  details: {
    ipAddress: string;
    device?: string;
    location?: string;
    userAgent?: string;
    success: boolean;
    reason?: string;
    metadata?: any;
  };
  
  sessionId?: string;
  resource?: ResourceType;
  actionAttempted?: ActionType;
  
  acknowledged: boolean;
  acknowledgedBy?: Types.ObjectId;
  acknowledgedAt?: Date;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PermissionSchema = new Schema<IPermission>({
  resource: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'QUOTATION', 'PRICE', 'PRODUCT', 'STOCK', 'PACKING', 'DELIVERY', 'CLIENT', 'STAFF', 'REPORT', 'DASHBOARD', 'SETTINGS', 'SYSTEM', 'OWN_PROFILE'],
    required: true
  },
  actions: [{
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN', 'MANAGE'],
    required: true
  }],
  conditions: {
    maxValue: Number,
    ownRecordsOnly: Boolean,
    department: String,
    requiresApproval: Boolean,
    timeWindow: String,
    ownClientId: Schema.Types.ObjectId
  }
}, { _id: true });

const SessionSchema = new Schema<ISession>({
  token: {
    type: String,
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  deviceFingerprint: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  location: String,
  userAgent: String,
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTrusted: {
    type: Boolean,
    default: false
  },
  context: {
    type: String,
    enum: ['CLIENT_PORTAL', 'STAFF_DESKTOP', 'ADMIN_PANEL'],
    default: 'STAFF_DESKTOP'
  }
}, { _id: true });

const LoginHistorySchema = new Schema<ILoginHistory>({
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  device: String,
  location: String,
  userAgent: String,
  success: {
    type: Boolean,
    required: true
  },
  failureReason: String,
  method: {
    type: String,
    enum: ['PASSWORD', 'SMS', 'EMAIL_LINK', 'PIN', 'RFID', 'BIOMETRIC'],
    default: 'PASSWORD'
  },
  sessionId: String
}, { _id: true });

const SecuritySettingsSchema = new Schema<ISecuritySettings>({
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
  lastPasswordReset: {
    type: Date,
    default: Date.now
  },
  mustChangePassword: {
    type: Boolean,
    default: false  // Changed: false for self-registration, true for invites
  },
  passwordHistory: [String],
  trustedDevices: [{
    fingerprint: String,
    name: String,
    addedAt: Date,
    lastUsed: Date
  }]
}, { _id: false });

// ----------------------------------------------------------------------------
// USER SCHEMA - REFACTORED
// ----------------------------------------------------------------------------

const UserSchema = new Schema<IUser>({
  // --- Universal Identity ---
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // --- Polymorphic Profile Links ---
  // At least one must be set (enforced in pre-save)
  clientProfile: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    sparse: true,      // Allows null
    unique: true,      // One client profile per user
    index: true
  },
  
  staffProfile: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    sparse: true,      // Allows null  
    unique: true,      // One staff profile per user
    index: true
  },
  
  // --- Classification ---
  accountType: {
    type: String,
    enum: ['CLIENT', 'STAFF', 'BOTH', 'ADMIN'],
    required: true,
    default: 'CLIENT',
    index: true
  },
  
  // --- Staff-Specific Fields (conditional) ---
  employeeId: {
    type: String,
    sparse: true,      // Allows null for clients
    unique: true,      // Unique when present
    trim: true,
    uppercase: true,
    match: /^EMP-\d{3,}$/  // EMP-001, etc.
  },
  
  role: {
    type: String,
    enum: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'STAFF', 'READONLY', 'CLIENT'],
    required: true,
    default: 'CLIENT',
    index: true
  },
  
  roleLevel: {
    type: Number,
    enum: [4, 3, 2, 1, 0],
    required: true,
    default: 0  // 0 for clients
  },
  
  permissions: {
    type: [PermissionSchema],
    default: []  // Empty for clients, populated by pre-save for staff
  },
  
  customPermissions: [PermissionSchema],
  
  // --- Authentication ---
  passwordHash: {
    type: String,
    required: true
  },
  
  pinHash: String,
  
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  
  // --- Session Management ---
  sessions: [SessionSchema],
  
  loginHistory: {
    type: [LoginHistorySchema],
    default: []
  },
  
  // --- Status ---
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'LOCKED', 'INACTIVE'],
    default: 'ACTIVE',  // Changed: Active immediately for self-registration
    index: true
  },
  
  // --- Security ---
  security: {
    type: SecuritySettingsSchema,
    default: () => ({})
  },
  
  // --- Audit ---
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Optional for self-registered clients
  },
  
  createdVia: {
    type: String,
    enum: ['SELF_REGISTRATION', 'STAFF_INVITE', 'ADMIN_CREATION', 'SYSTEM', 'CLIENT_UPGRADE'],
    default: 'SELF_REGISTRATION',
    required: true
  },
  
  lastLoginAt: Date,
  
  deletedAt: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INVITATION SCHEMA - ENHANCED
// ----------------------------------------------------------------------------

const InvitationSchema = new Schema<IInvitation>({
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Target identification (flexible)
  targetEmail: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true  // Allow null if using existingUserId
  },
  
  targetPhone: {
    type: String,
    trim: true,
    sparse: true
  },
  
  existingUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true  // For looking up invitations by user
  },
  
  // Invitation classification
  invitationType: {
    type: String,
    enum: ['STAFF_ONBOARDING', 'CLIENT_REGISTRATION', 'ROLE_UPGRADE', 'ADMIN_INVITE'],
    required: true,
    default: 'STAFF_ONBOARDING'
  },
  
  targetRole: {
    type: String,
    enum: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'STAFF', 'READONLY', 'CLIENT'],
    required: true
  },
  
  // Pre-created records for tracking
  pendingStaffRecord: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    sparse: true,
    index: true
  },
  
  targetClientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    sparse: true
  },
  
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
  },
  
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'],
    default: 'PENDING',
    index: true
  },
  
  acceptedAt: Date,
  acceptedByUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  ipAddress: String,
  userAgent: String

}, {
  timestamps: true
});

// ----------------------------------------------------------------------------
// SECURITY LOG SCHEMA
// ----------------------------------------------------------------------------

const SecurityLogSchema = new Schema<ISecurityLog>({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  action: {
    type: String,
    enum: [
      'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'PASSWORD_RESET',
      'PERMISSION_DENIED', 'SESSION_EXPIRED', 'SESSION_REVOKED',
      'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'INVITE_SENT', 'INVITE_ACCEPTED',
      'ROLE_CHANGED', 'PERMISSION_CHANGED', 'SUSPICIOUS_ACTIVITY',
      'CLIENT_REGISTERED', 'STAFF_PROFILE_ACTIVATED'
    ],
    required: true,
    index: true
  },
  
  severity: {
    type: String,
    enum: ['INFO', 'WARNING', 'CRITICAL'],
    required: true,
    default: 'INFO',
    index: true
  },
  
  details: {
    ipAddress: {
      type: String,
      required: true
    },
    device: String,
    location: String,
    userAgent: String,
    success: {
      type: Boolean,
      required: true
    },
    reason: String,
    metadata: Schema.Types.Mixed
  },
  
  sessionId: String,
  resource: String,
  actionAttempted: String,
  
  acknowledged: {
    type: Boolean,
    default: false
  },
  
  acknowledgedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  acknowledgedAt: Date

}, {
  timestamps: true
});

SecurityLogSchema.index({ user: 1, timestamp: -1 });
SecurityLogSchema.index({ action: 1, severity: 1, timestamp: -1 });

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ accountType: 1, status: 1 });
UserSchema.index({ 'sessions.token': 1 });
UserSchema.index({ 'sessions.refreshToken': 1 });
UserSchema.index({ clientProfile: 1 }, { sparse: true });
UserSchema.index({ staffProfile: 1 }, { sparse: true });
UserSchema.index({ employeeId: 1 }, { sparse: true });

InvitationSchema.index({ token: 1, status: 1 });
InvitationSchema.index({ existingUserId: 1, status: 1 }); // For finding pending invites for user
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

UserSchema.virtual('isLocked').get(function(this: IUser) {
  if (this.security.lockedUntil && this.security.lockedUntil > new Date()) {
    return true;
  }
  return false;
});

UserSchema.virtual('isPasswordExpired').get(function(this: IUser) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return this.passwordChangedAt < ninetyDaysAgo;
});

UserSchema.virtual('daysToPasswordExpiry').get(function(this: IUser) {
  const expiryDate = new Date(this.passwordChangedAt.getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
});

UserSchema.virtual('activeSessionCount').get(function(this: IUser) {
  return this.sessions.filter(s => s.isActive && s.expiresAt > new Date()).length;
});

/**
 * Check if user has client capabilities
 */
UserSchema.virtual('isClient').get(function(this: IUser) {
  return ['CLIENT', 'BOTH'].includes(this.accountType) && !!this.clientProfile;
});

/**
 * Check if user has staff capabilities  
 */
UserSchema.virtual('isStaff').get(function(this: IUser) {
  return ['STAFF', 'BOTH', 'ADMIN'].includes(this.accountType) && !!this.staffProfile;
});

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Ensure at least one profile is linked
 */
UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Must have at least client or staff profile
    if (!this.clientProfile && !this.staffProfile) {
      return (new Error('User must have at least one profile (client or staff)'));
    }
    
    // Set accountType based on profiles if not explicitly set
    if (this.clientProfile && this.staffProfile) {
      this.accountType = 'BOTH';
    } else if (this.clientProfile) {
      this.accountType = 'CLIENT';
      this.role = 'CLIENT';
      this.roleLevel = 0;
    } else if (this.staffProfile) {
      this.accountType = this.role === 'ADMIN' ? 'ADMIN' : 'STAFF';
    }
  }
  
  ;
});

/**
 * Pre-save: Hash password if modified
 */
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return ;
  
  // Password strength validation could go here
  
  ;
});

/**
 * Pre-save: Set role level and permissions based on role
 */
UserSchema.pre('save', function(next) {
  const roleLevels: Record<SystemRole, RoleLevel> = {
    'ADMIN': 4,
    'MANAGER': 3,
    'SUPERVISOR': 2,
    'STAFF': 1,
    'READONLY': 0,
    'CLIENT': 0
  };
  
  this.roleLevel = roleLevels[this.role];
  
  // Auto-populate base permissions for staff (skip for clients unless custom)
  if (this.isNew || this.isModified('role')) {
    if (this.accountType !== 'CLIENT' || this.role !== 'CLIENT') {
      this.permissions = getBasePermissions(this.role);
    } else {
      this.permissions = getClientPermissions();
    }
  }
  
  ;
});

/**
 * Pre-save: Session management for staff (optional restriction)
 */
UserSchema.pre('save', async function(next) {
  if (this.isModified('sessions') && ['STAFF', 'ADMIN', 'BOTH'].includes(this.accountType)) {
    const activeSessions = this.sessions.filter(s => s.isActive);
    const maxSessions = {
      'ADMIN': Infinity,
      'MANAGER': 3,
      'SUPERVISOR': 2,
      'STAFF': 2,
      'READONLY': 1,
      'CLIENT': 5  // Clients can have more sessions (mobile + web)
    };
    
    if (activeSessions.length > maxSessions[this.role]) {
      const sorted = activeSessions.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
      for (let i = 0; i < sorted.length - maxSessions[this.role]; i++) {
        const session = this.sessions.find(s => s.token === sorted[i].token);
        if (session) session.isActive = false;
      }
    }
  }
 ;
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.methods.comparePin = async function(candidatePin: string): Promise<boolean> {
  if (!this.pinHash) return false;
  return bcrypt.compare(candidatePin, this.pinHash);
};

/**
 * Enhanced permission check with account type awareness
 */
UserSchema.methods.hasPermission = function(
  resource: ResourceType, 
  action: ActionType, 
  context?: { value?: number; isOwner?: boolean; department?: string; clientId?: Types.ObjectId }
): boolean {
  // Admin override
  if (this.role === 'ADMIN') return true;
  
  // Check status
  if (this.status !== 'ACTIVE') return false;
  
  // Client-specific logic
  if (this.accountType === 'CLIENT' || (this.accountType === 'BOTH' && resource === 'OWN_PROFILE')) {
    // Clients can only access own profile and their own orders/invoices
    if (resource === 'OWN_PROFILE') return true;
    if (resource === 'ORDER' && action === 'CREATE') return true; // Can place orders
    if (resource === 'ORDER' && action === 'READ' && context?.isOwner) return true;
    if (resource === 'INVOICE' && action === 'READ' && context?.isOwner) return true;
    if (resource === 'CLIENT' && action === 'UPDATE' && context?.clientId?.toString() === this.clientProfile?.toString()) return true;
    return false;
  }
  
  // Staff permission logic
  const allPermissions = [...this.permissions, ...this.customPermissions];
  const permission = allPermissions.find(p => p.resource === resource);
  
  if (!permission) return false;
  if (!permission.actions.includes(action) && !permission.actions.includes('ADMIN')) return false;
  
  // Check conditions
  if (permission.conditions) {
    if (permission.conditions.maxValue !== undefined && context?.value) {
      if (context.value > permission.conditions.maxValue) return false;
    }
    if (permission.conditions.ownRecordsOnly && !context?.isOwner) return false;
    if (permission.conditions.department && context?.department !== permission.conditions.department) return false;
  }
  
  return true;
};

/**
 * Check module access (convenience method)
 */
UserSchema.methods.canAccessModule = function(moduleName: string): boolean {
  const moduleResourceMap: Record<string, ResourceType> = {
    'orders': 'ORDER',
    'invoices': 'INVOICE',
    'clients': 'CLIENT',
    'staff': 'STAFF',
    'dashboard': 'DASHBOARD',
    'reports': 'REPORT',
    'settings': 'SETTINGS'
  };
  
  const resource = moduleResourceMap[moduleName.toLowerCase()];
  if (!resource) return false;
  
  return this.hasPermission(resource, 'READ');
};

UserSchema.methods.recordLoginAttempt = async function(
  success: boolean, 
  details: { ipAddress: string; device: string; userAgent: string; method: LoginMethod; reason?: string }
): Promise<void> {
  this.loginHistory.push({
    timestamp: new Date(),
    ipAddress: details.ipAddress,
    device: details.device,
    userAgent: details.userAgent,
    success,
    failureReason: details.reason,
    method: details.method
  });
  
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  
  if (success) {
    this.security.failedLoginAttempts = 0;
    this.lastLoginAt = new Date();
    if (this.status === 'LOCKED') this.status = 'ACTIVE';
  } else {
    this.security.failedLoginAttempts += 1;
    if (this.security.failedLoginAttempts >= 5) {
      this.lockAccount(30);
    }
  }
  
  await this.save();
};

UserSchema.methods.createSession = async function(
  deviceInfo: { device: string; ipAddress: string; userAgent: string; fingerprint: string; isTrusted?: boolean },
  context: 'CLIENT_PORTAL' | 'STAFF_DESKTOP' | 'ADMIN_PANEL' = 'STAFF_DESKTOP'
): Promise<ISession> {
  const token = crypto.randomBytes(32).toString('hex');
  const refreshToken = crypto.randomBytes(32).toString('hex');
  
  const session: ISession = {
    token,
    refreshToken,
    device: deviceInfo.device,
    deviceFingerprint: deviceInfo.fingerprint,
    ipAddress: deviceInfo.ipAddress,
    userAgent: deviceInfo.userAgent,
    startedAt: new Date(),
    lastActiveAt: new Date(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    isActive: true,
    isTrusted: deviceInfo.isTrusted || false,
    context
  };
  
  this.sessions.push(session);
  await this.save();
  
  return session;
};

UserSchema.methods.revokeSession = async function(sessionId: string): Promise<void> {
  const session = this.sessions.find((s: { token: string; refreshToken: string; }) => s.token === sessionId || s.refreshToken === sessionId);
  if (session) {
    session.isActive = false;
    await this.save();
  }
};

UserSchema.methods.revokeOtherSessions = async function(currentSessionId: string): Promise<void> {
  this.sessions.forEach((session: { token: string; refreshToken: string; isActive: boolean; }) => {
    if (session.token !== currentSessionId && session.refreshToken !== currentSessionId) {
      session.isActive = false;
    }
  });
  await this.save();
};

UserSchema.methods.changePassword = async function(newPassword: string): Promise<void> {
  for (const oldHash of this.security.passwordHistory) {
    if (await bcrypt.compare(newPassword, oldHash)) {
      throw new Error('Cannot reuse recent passwords');
    }
  }
  
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(newPassword, salt);
  this.passwordChangedAt = new Date();
  this.security.lastPasswordReset = new Date();
  this.security.mustChangePassword = false;
  
  this.security.passwordHistory.unshift(this.passwordHash);
  if (this.security.passwordHistory.length > 5) {
    this.security.passwordHistory.pop();
  }
  
  this.sessions.forEach((s: { isActive: boolean; }) => s.isActive = false);
  await this.save();
};

UserSchema.methods.lockAccount = function(durationMinutes: number): void {
  this.security.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  this.status = 'LOCKED';
};

UserSchema.methods.unlockAccount = function(): void {
  this.security.lockedUntil = undefined;
  this.security.failedLoginAttempts = 0;
  this.status = 'ACTIVE';
};

UserSchema.methods.generatePasswordResetToken = function(): string {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Upgrade client to staff (Role Upgrade)
 */
UserSchema.methods.upgradeToStaff = async function(
  staffId: Types.ObjectId, 
  role: SystemRole, 
  invitedBy: Types.ObjectId
): Promise<void> {
  if (!['STAFF', 'SUPERVISOR', 'MANAGER', 'ADMIN'].includes(role)) {
    throw new Error('Invalid staff role');
  }
  
  this.staffProfile = staffId;
  this.accountType = this.clientProfile ? 'BOTH' : 'STAFF';
  this.role = role;
  this.invitedBy = invitedBy;
  this.createdVia = 'CLIENT_UPGRADE';
  this.security.mustChangePassword = true; // Force password reset on first staff login
  
  await this.save();
};

UserSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    email: this.email,
    phone: this.phone,
    accountType: this.accountType,
    role: this.role,
    isClient: this.isClient,
    isStaff: this.isStaff,
    clientProfile: this.clientProfile,
    staffProfile: this.staffProfile,
    employeeId: this.employeeId,
    status: this.status,
    mustChangePassword: this.security.mustChangePassword,
    twoFactorEnabled: this.security.twoFactorEnabled
  };
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Find by credentials - supports employeeId (staff) or email/phone (clients)
 */
UserSchema.statics.findByCredentials = async function(
  identifier: string,  // employeeId or email or phone
  password: string
): Promise<IUser | null> {
  // Try to find by employeeId first (staff), then email, then phone
  let user = await this.findOne({ 
    $or: [
      { employeeId: identifier.toUpperCase() },
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ],
    status: { $in: ['ACTIVE', 'LOCKED', 'PENDING'] }
  });
  
  if (!user) return null;
  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return null;
  
  return user;
};

UserSchema.statics.findByRefreshToken = async function(token: string): Promise<IUser | null> {
  return this.findOne({
    'sessions.refreshToken': token,
    'sessions.isActive': true,
    'sessions.expiresAt': { $gt: new Date() }
  });
};

/**
 * Find by client profile ID
 */
UserSchema.statics.findByClientProfile = async function(clientId: Types.ObjectId): Promise<IUser | null> {
  return this.findOne({ clientProfile: clientId });
};

/**
 * Find by staff profile ID  
 */
UserSchema.statics.findByStaffProfile = async function(staffId: Types.ObjectId): Promise<IUser | null> {
  return this.findOne({ staffProfile: staffId });
};

/**
 * Get base permissions for role
 */
function getBasePermissions(role: SystemRole): IPermission[] {
  const basePermissions: Record<SystemRole, IPermission[]> = {
    'ADMIN': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] },
      { resource: 'PRODUCT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'STOCK', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'STAFF', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] },
      { resource: 'REPORT', actions: ['READ', 'EXPORT', 'ADMIN'] },
      { resource: 'DASHBOARD', actions: ['READ', 'UPDATE', 'ADMIN'] },
      { resource: 'SETTINGS', actions: ['READ', 'UPDATE', 'ADMIN'] },
      { resource: 'SYSTEM', actions: ['ADMIN'] }
    ],
    'MANAGER': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE', 'EXPORT'], conditions: { maxValue: 500000 } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE', 'EXPORT'] },
      { resource: 'QUOTATION', actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE', 'EXPORT'] },
      { resource: 'PRICE', actions: ['READ', 'UPDATE'] },
      { resource: 'PRODUCT', actions: ['READ', 'UPDATE'] },
      { resource: 'STOCK', actions: ['READ', 'UPDATE'] },
      { resource: 'PACKING', actions: ['READ', 'UPDATE', 'ADMIN'] },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'STAFF', actions: ['READ', 'UPDATE'] },
      { resource: 'REPORT', actions: ['READ', 'EXPORT'] },
      { resource: 'DASHBOARD', actions: ['READ'] }
    ],
    'SUPERVISOR': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE'], conditions: { maxValue: 100000, ownRecordsOnly: false } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'QUOTATION', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'PRICE', actions: ['READ', 'UPDATE'], conditions: { maxValue: 50000 } },
      { resource: 'CLIENT', actions: ['CREATE', 'READ', 'UPDATE'] },
      { resource: 'PACKING', actions: ['READ', 'UPDATE'] },
      { resource: 'REPORT', actions: ['READ'] },
      { resource: 'DASHBOARD', actions: ['READ'] }
    ],
    'STAFF': [
      { resource: 'ORDER', actions: ['CREATE', 'READ', 'UPDATE'], conditions: { maxValue: 50000, ownRecordsOnly: true } },
      { resource: 'INVOICE', actions: ['CREATE', 'READ'], conditions: { ownRecordsOnly: true } },
      { resource: 'QUOTATION', actions: ['CREATE', 'READ'], conditions: { ownRecordsOnly: true } },
      { resource: 'PRICE', actions: ['READ'] },
      { resource: 'PACKING', actions: ['READ', 'UPDATE'], conditions: { ownRecordsOnly: true } },
      { resource: 'CLIENT', actions: ['READ', 'CREATE'] },
      { resource: 'DASHBOARD', actions: ['READ'] }
    ],
    'READONLY': [
      { resource: 'ORDER', actions: ['READ'] },
      { resource: 'INVOICE', actions: ['READ'] },
      { resource: 'CLIENT', actions: ['READ'] },
      { resource: 'REPORT', actions: ['READ'] }
    ],
    'CLIENT': [
      { resource: 'OWN_PROFILE', actions: ['READ', 'UPDATE'] },
      { resource: 'ORDER', actions: ['CREATE', 'READ'], conditions: { ownRecordsOnly: true } },
      { resource: 'INVOICE', actions: ['READ'], conditions: { ownRecordsOnly: true } },
      { resource: 'QUOTATION', actions: ['READ'], conditions: { ownRecordsOnly: true } }
    ]
  };
  
  return basePermissions[role] || [];
}

/**
 * Get client-specific permissions (minimal)
 */
function getClientPermissions(): IPermission[] {
  return [
    { resource: 'OWN_PROFILE', actions: ['READ', 'UPDATE'] },
    { resource: 'ORDER', actions: ['CREATE', 'READ'], conditions: { ownRecordsOnly: true } },
    { resource: 'INVOICE', actions: ['READ'], conditions: { ownRecordsOnly: true } }
  ];
}

/**
 * Create invitation - Enhanced to support multiple invitation types
 */
UserSchema.statics.createInvitation = async function(
  invitedBy: Types.ObjectId,
  invitationData: {
    type: 'STAFF_ONBOARDING' | 'CLIENT_REGISTRATION' | 'ROLE_UPGRADE' | 'ADMIN_INVITE';
    targetRole: SystemRole;
    email?: string;
    phone?: string;
    existingUserId?: Types.ObjectId;
    pendingStaffRecord?: Types.ObjectId;
    targetClientId?: Types.ObjectId;
  }
): Promise<IInvitation> {
  const Invitation = mongoose.model<IInvitation>('Invitation');
  
  const token = crypto.randomBytes(32).toString('hex');
  
  const invitation = new Invitation({
    invitedBy,
    targetEmail: invitationData.email,
    targetPhone: invitationData.phone,
    existingUserId: invitationData.existingUserId,
    invitationType: invitationData.type,
    targetRole: invitationData.targetRole,
    pendingStaffRecord: invitationData.pendingStaffRecord,
    targetClientId: invitationData.targetClientId,
    token,
    status: 'PENDING'
  });
  
  await invitation.save();
  return invitation;
};

UserSchema.statics.getSecurityStats = async function(): Promise<{
  totalUsers: number;
  activeNow: number;
  lockedAccounts: number;
  pendingInvitations: number;
  failedLoginsToday: number;
  clientCount: number;
  staffCount: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [
    totalUsers, 
    activeNow, 
    lockedAccounts, 
    pendingInvitations,
    clientCount,
    staffCount
  ] = await Promise.all([
    this.countDocuments({ deletedAt: { $exists: false } }),
    this.countDocuments({ 
      'sessions.isActive': true, 
      'sessions.expiresAt': { $gt: new Date() } 
    }),
    this.countDocuments({ status: 'LOCKED' }),
    mongoose.model('Invitation').countDocuments({ status: 'PENDING' }),
    this.countDocuments({ accountType: { $in: ['CLIENT', 'BOTH'] } }),
    this.countDocuments({ accountType: { $in: ['STAFF', 'ADMIN', 'BOTH'] } })
  ]);
  
  return {
    totalUsers,
    activeNow,
    lockedAccounts,
    pendingInvitations,
    failedLoginsToday: 0, // Would need aggregation
    clientCount,
    staffCount
  };
};

// ----------------------------------------------------------------------------
// INVITATION METHODS
// ----------------------------------------------------------------------------

InvitationSchema.methods.accept = async function(
  ipAddress: string, 
  userAgent: string,
  acceptedByUserId: Types.ObjectId
): Promise<void> {
  this.status = 'ACCEPTED';
  this.acceptedAt = new Date();
  this.ipAddress = ipAddress;
  this.userAgent = userAgent;
  this.acceptedByUser = acceptedByUserId;
  await this.save();
};

InvitationSchema.methods.revoke = async function(): Promise<void> {
  this.status = 'REVOKED';
  await this.save();
};

InvitationSchema.methods.isExpired = function(): boolean {
  return this.expiresAt < new Date();
};

// ----------------------------------------------------------------------------
// MODEL EXPORTS
// ----------------------------------------------------------------------------

//export const User = mongoose.model<IUser>('User', UserSchema);
//export const Invitation = mongoose.model<IInvitation>('Invitation', InvitationSchema);
//export const SecurityLog = mongoose.model<ISecurityLog>('SecurityLog', SecurityLogSchema);

//export default { User, Invitation, SecurityLog };

// ----------------------------------------------------------------------------
// MODEL EXPORTS - FIXED FOR NEXT.JS HOT RELOAD
// ----------------------------------------------------------------------------
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Invitation = mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);
export const SecurityLog = mongoose.models.SecurityLog || mongoose.model<ISecurityLog>('SecurityLog', SecurityLogSchema);

// ============================================================================
// INTEGRATION EXAMPLES - REFACTORED FOR NEW ARCHITECTURE
// ============================================================================

/**
 * CLIENT SELF-REGISTRATION FLOW:
 * 
 * // POST /auth/register-client
 * const { email, phone, password, name } = req.body;
 * 
 * // 1. Check existing
 * const existing = await User.findOne({ $or: [{ email }, { phone }] });
 * if (existing) return res.status(409).json({ error: 'Account exists' });
 * 
 * // 2. Create Client record first
 * const client = await Client.create({
 *   name,
 *   phones: [{ number: phone, isPrimary: true }],
 *   emails: [email],
 *   category: 'RETAIL'
 * });
 * 
 * // 3. Create User with client profile only
 * const user = new User({
 *   email,
 *   phone,
 *   passwordHash: await bcrypt.hash(password, 12),
 *   clientProfile: client._id,
 *   accountType: 'CLIENT',
 *   role: 'CLIENT',
 *   createdVia: 'SELF_REGISTRATION',
 *   status: 'ACTIVE'
 *   // staffProfile: undefined (not set)
 *   // employeeId: undefined (not set)
 * });
 * await user.save();
 * 
 * // 4. Link back
 * client.userAccount = user._id;
 * await client.save();
 * 
 * // 5. Log
 * await SecurityLog.create({
 *   user: user._id,
 *   action: 'CLIENT_REGISTERED',
 *   severity: 'INFO',
 *   details: { ipAddress: req.ip, success: true }
 * });
 */

/**
 * STAFF INVITATION FLOW (New Hire):
 * 
 * // 1. Admin creates Staff record (pending)
 * const staff = await Staff.create({
 *   employeeId: 'EMP-042',
 *   email: 'newhire@malex.co.ke',
 *   phone: '+254712345678',
 *   status: 'PENDING_INVITE'
 *   // user field not set yet
 * });
 * 
 * // 2. Create invitation
 * const invitation = await User.createInvitation(adminUser._id, {
 *   type: 'STAFF_ONBOARDING',
 *   targetRole: 'STAFF',
 *   email: staff.email,
 *   phone: staff.phone,
 *   pendingStaffRecord: staff._id
 * });
 * 
 * // 3. Send via Messaging
 * await sendStaffInvitation(invitation);
 * 
 * // 4. User accepts (POST /auth/accept-invitation)
 * // - Sets password
 * // - Creates User with staffProfile linked
 * // - Activates Staff record
 */

/**
 * CLIENT-TO-STAFF UPGRADE FLOW:
 * 
 * // 1. Admin finds client
 * const clientUser = await User.findByClientProfile(clientId);
 * 
 * // 2. Create staff record
 * const staff = await Staff.create({
 *   employeeId: 'EMP-099',
 *   email: clientUser.email, // Same email
 *   user: clientUser._id, // Pre-link
 *   status: 'PENDING_INVITE'
 * });
 * 
 * // 3. Create upgrade invitation
 * const invitation = await User.createInvitation(adminUser._id, {
 *   type: 'ROLE_UPGRADE',
 *   targetRole: 'STAFF',
 *   existingUserId: clientUser._id,
 *   pendingStaffRecord: staff._id,
 *   email: clientUser.email
 * });
 * 
 * // 4. User accepts - upgrades existing account
 * await clientUser.upgradeToStaff(staff._id, 'STAFF', adminUser._id);
 * // accountType becomes 'BOTH'
 */

/**
 * LOGIN FLOW (Supports both Client and Staff):
 * 
 * // POST /auth/login
 * const { identifier, password, deviceType } = req.body; 
 * // identifier can be: employeeId (STAFF), email, or phone
 * 
 * const user = await User.findByCredentials(identifier, password);
 * if (!user) return res.status(401).json({ error: 'Invalid credentials' });
 * 
 * // Determine context based on account type and device
 * let context: 'CLIENT_PORTAL' | 'STAFF_DESKTOP' | 'ADMIN_PANEL' = 'STAFF_DESKTOP';
 * if (user.accountType === 'CLIENT' && deviceType === 'mobile') {
 *   context = 'CLIENT_PORTAL';
 * } else if (user.role === 'ADMIN') {
 *   context = 'ADMIN_PANEL';
 * }
 * 
 * // Check permissions for context
 * if (context === 'CLIENT_PORTAL' && !user.isClient) {
 *   return res.status(403).json({ error: 'No client access' });
 * }
 * 
 * const session = await user.createSession({
 *   device: deviceType,
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 *   fingerprint: generateFingerprint(req)
 * }, context);
 * 
 * await user.recordLoginAttempt(true, {
 *   ipAddress: req.ip,
 *   device: deviceType,
 *   userAgent: req.headers['user-agent'],
 *   method: 'PASSWORD'
 * });
 * 
 * // Return appropriate dashboard based on accountType
 * const dashboard = user.isStaff ? 'staff-dashboard' : 'client-portal';
 */

/**
 * PERMISSION CHECK EXAMPLES:
 * 
 * // Client trying to view own order (ALLOWED)
 * clientUser.hasPermission('ORDER', 'READ', { isOwner: true, clientId: clientUser.clientProfile });
 * // Returns: true
 * 
 * // Client trying to view other client's order (DENIED)
 * clientUser.hasPermission('ORDER', 'READ', { isOwner: false });
 * // Returns: false
 * 
 * // Staff with STAFF role trying to approve order > 50k (DENIED - exceeds maxValue)
 * staffUser.hasPermission('ORDER', 'APPROVE', { value: 75000 });
 * // Returns: false
 * 
 * // Admin trying to do anything (ALLOWED)
 * adminUser.hasPermission('ANYTHING', 'ADMIN');
 * // Returns: true
 */