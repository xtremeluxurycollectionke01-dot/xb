// lib/models/User.ts

/*import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  staff: mongoose.Types.ObjectId;
  email: string;
  phone?: string;
  password: string;
  pin?: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  permissions: any[];
  sessions: any[];
  security: {
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    twoFactorTempBackupCodes?: any[];
    passwordChangedAt?: Date;
    passwordExpiry?: Date;
    failedLoginAttempts: number;
    failedPinAttempts: number;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    lockedAt?: Date;
    pinDisabledUntil?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    forcePasswordChange?: boolean;
    tempToken?: string;
    tempTokenExpires?: Date;
  };
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  password: { type: String, required: true, select: false },
  pin: { type: String, select: false },
  role: { type: String, required: true, default: 'STAFF' },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'SUSPENDED', 'LOCKED'], 
    default: 'ACTIVE' 
  },
  permissions: [{
    resource: String,
    actions: [String],
    conditions: Schema.Types.Mixed
  }],
  sessions: [{
    token: String,
    refreshToken: String,
    device: String,
    ipAddress: String,
    location: String,
    isActive: { type: Boolean, default: true },
    isTrusted: { type: Boolean, default: false },
    trustedAt: Date,
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
    endedAt: Date,
    expiresAt: Date
  }],
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    twoFactorTempBackupCodes: [{ code: String, used: Boolean }],
    passwordChangedAt: Date,
    passwordExpiry: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    failedPinAttempts: { type: Number, default: 0 },
    lastLoginAt: Date,
    lastLoginIp: String,
    lockedAt: Date,
    pinDisabledUntil: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    forcePasswordChange: Boolean,
    tempToken: String,
    tempTokenExpires: Date
  },
  preferences: Schema.Types.Mixed,
  suspension: {
    reason: String,
    suspendedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    suspendedAt: Date,
    expiresAt: Date
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);*/

// lib/models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  staff: mongoose.Types.ObjectId;
  email: string;
  phone?: string;
  password: string;
  pin?: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  permissions: any[];
  sessions: any[];
  security: {
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    twoFactorTempBackupCodes?: any[];
    passwordChangedAt?: Date;
    passwordExpiry?: Date;
    failedLoginAttempts: number;
    failedPinAttempts: number;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    lockedAt?: Date;
    pinDisabledUntil?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    forcePasswordChange?: boolean;
    tempToken?: string;
    tempTokenExpires?: Date;
  };
  suspension?: {
    reason?: string;
    suspendedBy?: mongoose.Types.ObjectId;
    suspendedAt?: Date;
    expiresAt?: Date;
  };
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  password: { type: String, required: true, select: false },
  pin: { type: String, select: false },
  role: { type: String, required: true, default: 'STAFF' },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'SUSPENDED', 'LOCKED'], 
    default: 'ACTIVE' 
  },
  permissions: [{
    resource: String,
    actions: [String],
    conditions: Schema.Types.Mixed
  }],
  sessions: [{
    token: String,
    refreshToken: String,
    device: String,
    ipAddress: String,
    location: String,
    isActive: { type: Boolean, default: true },
    isTrusted: { type: Boolean, default: false },
    trustedAt: Date,
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
    endedAt: Date,
    expiresAt: Date
  }],
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    twoFactorTempBackupCodes: [{ code: String, used: Boolean }],
    passwordChangedAt: Date,
    passwordExpiry: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    failedPinAttempts: { type: Number, default: 0 },
    lastLoginAt: Date,
    lastLoginIp: String,
    lockedAt: Date,
    pinDisabledUntil: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    forcePasswordChange: Boolean,
    tempToken: String,
    tempTokenExpires: Date
  },
  suspension: {
    reason: { type: String, default: null },
    suspendedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    suspendedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null }
  },
  preferences: Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);