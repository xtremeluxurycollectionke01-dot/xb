// ============================================================================
// STAFF MODULE
// ============================================================================
// Core Purpose: Identity, permissions, and automatic activity tracking
// Interconnections:
//   - Links to User (authentication)
//   - Activity logs auto-generated from Orders, Documents, Price List actions
//   - Time Management derived from activity patterns (no manual clock-in)
//   - Dashboard aggregates performance metrics
//   - Permissions enforce business rules (approval limits, separation of duties)
// ============================================================================

/*import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * System resources that can be protected
 *
export type ResourceType = 
  | 'ORDER' 
  | 'INVOICE' 
  | 'QUOTATION' 
  | 'CASH_SALE'
  | 'PRICE' 
  | 'STOCK' 
  | 'PRODUCT'
  | 'CLIENT'
  | 'STAFF'
  | 'REPORT'
  | 'DASHBOARD'
  | 'PACKAGING'
  | 'TIME'
  | 'DOCUMENT'
  | 'SUPPLIER';

/**
 * CRUD + approval actions
 *
export type ActionType = 
  | 'CREATE' 
  | 'READ' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'APPROVE'
  | 'ISSUE'
  | 'VOID'
  | 'EXPORT'
  | 'ADMIN';

/**
 * Named roles matching actual team structure
 * Each role has predefined permission sets
 *
//export type RoleName = 'JACKY' | 'GILBERT' | 'GEORGE' | 'ADMIN' | 'DELIVERY' | 'VIEWER';
export type RoleName = 
  | 'SYSTEM_ADMIN'      // Was: ADMIN (technical superuser)
  | 'SALES_MANAGER'     // Was: GILBERT (approves large orders, manages stock)
  | 'SALES_ASSOCIATE'   // Was: JACKY (creates orders, issues invoices)
  | 'CASHIER'           // Was: GEORGE (cash sales, payments, reports)
  | 'DELIVERY'          // Keep: delivery personnel
  | 'VIEWER';            // Keep: read-only auditor
//  | 'INVENTORY_MANAGER' // New: could split from SALES_MANAGER
//  | 'FINANCE_ADMIN';    // New: could split from CASHIER
/**
 * Permission conditions - granular control
 *
export interface IPermissionConditions {
  maxOrderValue?: number;        // Cannot create/approve orders above this
  maxDiscountPercent?: number;   // Cannot give discount above this
  canChangePrices?: boolean;     // Access to modify Price List
  canApproveOwn?: boolean;       // Can approve own work (separation of duties)
  canModifyLocked?: boolean;     // Can edit confirmed/issued documents
  requiresDualApproval?: boolean; // High-value needs second signature
  allowedCategories?: string[];  // Restrict to specific product categories
  allowedClients?: string[];     // Restrict to specific client accounts
}

interface IStaffModel extends Model<IStaff> {
  createWithRole(
    userId: Types.ObjectId,
    employeeId: string,
    personalInfo: { firstName: string; lastName: string; email: string; phone: string },
    roleName: RoleName
  ): Promise<IStaff>;
}

/**
 * Individual permission grant
 *
export interface IPermission {
  resource: ResourceType;
  actions: ActionType[];
  conditions?: IPermissionConditions;
}

/**
 * Role definition with permissions
 *
export interface IRole {
  name: RoleName;
  displayName: string;           // "Sales Associate", "Operations Manager"
  permissions: IPermission[];
  description?: string;
}

/**
 * Daily schedule entry
 *
export interface IScheduleDay {
  start: string;                 // "08:00" (24-hour format)
  end: string;                   // "17:00"
  isWorkingDay: boolean;
  breakStart?: string;           // "13:00"
  breakEnd?: string;             // "14:00"
}

/**
 * Weekly schedule
 *
export interface IWorkSchedule {
  monday: IScheduleDay;
  tuesday: IScheduleDay;
  wednesday: IScheduleDay;
  thursday: IScheduleDay;
  friday: IScheduleDay;
  saturday: IScheduleDay;
  sunday: IScheduleDay;
}

/**
 * Activity log entry - append-only audit trail
 * Auto-generated from system actions, never manual entry
 *
export interface IActivityLog {
  timestamp: Date;
  action: ActivityAction;
  resource: ResourceType;
  targetId?: Types.ObjectId;     // The document/order affected
  targetNumber?: string;         // Human-readable reference (INV-001, ORD-123)
  details: {
    previousValue?: any;         // For updates: what changed
    newValue?: any;
    metadata?: Record<string, any>; // Context-specific data
  };
  ipAddress?: string;            // For security audit
  userAgent?: string;            // Device/browser info
  duration?: number;             // Action duration in seconds (if applicable)
}

/**
 * Specific actions that can be logged
 *
export type ActivityAction = 
  // Order lifecycle
  | 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_CONFIRMED' 
  | 'ORDER_CANCELLED' | 'ORDER_PACKED' | 'ORDER_DELIVERED'
  // Document lifecycle
  | 'INVOICE_ISSUED' | 'INVOICE_PAID' | 'INVOICE_VOIDED'
  | 'QUOTATION_ISSUED' | 'QUOTATION_ACCEPTED' | 'QUOTATION_EXPIRED'
  | 'CASH_SALE_ISSUED'
  // Product/Price actions
  | 'PRICE_UPDATED' | 'PRODUCT_CREATED' | 'STOCK_ADJUSTED'
  // Client actions
  | 'CLIENT_CREATED' | 'CLIENT_UPDATED' | 'CLIENT_CONTACTED'
  // Staff actions
  | 'LOGIN' | 'LOGOUT' | 'PERMISSION_CHANGED' | 'PASSWORD_RESET'
  // Packaging
  | 'ITEM_SCANNED' | 'PACKAGE_COMPLETED' | 'DISCREPANCY_NOTED'
  // System
  | 'REPORT_GENERATED' | 'EXPORT_CREATED' | 'BACKUP_CREATED';

/**
 * Performance metrics - auto-calculated from activity
 *
export interface IPerformanceMetrics {
  // Order processing
  ordersCreatedThisMonth: number;
  ordersProcessedThisMonth: number;
  averageOrderValue: number;
  
  // Packaging efficiency (for Jacky)
  itemsPackedThisMonth: number;
  averagePackingTimeMinutes: number;  // From PACKING start to last scan
  
  // Document accuracy
  documentsIssuedThisMonth: number;
  documentsVoidedThisMonth: number;
  errorRatePercent: number;           // voided / issued * 100
  
  // Financial
  totalRevenueThisMonth: number;      // Sum of their invoices
  totalCollectedThisMonth: number;    // Payments they recorded
  
  // Time patterns (derived from activity)
  averageStartTime?: string;          // "08:15" (derived from first daily action)
  averageEndTime?: string;            // "17:30" (derived from last daily action)
  activeHoursToday: number;           // Calculated from activity density
  
  // Quality
  clientComplaints: number;
  clientCompliments: number;
  
  lastCalculatedAt: Date;
}

/**
 * Staff document interface
 *
export interface IStaff extends Document {
  // --- Identity ---
  user: Types.ObjectId;              // Link to auth system (User model)
  employeeId: string;                // HR identifier: EMP-001
  
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;                    // URL to photo
  
  // --- Role & Permissions ---
  role: IRole;
  customPermissions?: IPermission[]; // Override/add to role defaults
  
  // --- Schedule ---
  schedule: IWorkSchedule;
  timezone: string;                  // "Africa/Nairobi"
  
  // --- Activity & Performance ---
  activity: IActivityLog[];          // Append-only log (limited retention)
  metrics: IPerformanceMetrics;      // Auto-calculated aggregates
  
  // --- Status ---
  isActive: boolean;
  joinedAt: Date;
  leftAt?: Date;
  
  // --- Audit ---
  lastLoginAt?: Date;
  lastLoginIp?: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PermissionConditionsSchema = new Schema<IPermissionConditions>({
  maxOrderValue: Number,
  maxDiscountPercent: {
    type: Number,
    min: 0,
    max: 100
  },
  canChangePrices: Boolean,
  canApproveOwn: {
    type: Boolean,
    default: false  // Separation of duties: default false
  },
  canModifyLocked: Boolean,
  requiresDualApproval: Boolean,
  allowedCategories: [String],
  allowedClients: [String]
}, { _id: false });

const PermissionSchema = new Schema<IPermission>({
  resource: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'QUOTATION', 'CASH_SALE', 'PRICE', 'STOCK', 
           'PRODUCT', 'CLIENT', 'STAFF', 'REPORT', 'DASHBOARD', 'PACKAGING', 
           'TIME', 'DOCUMENT'],
    required: true
  },
  actions: [{
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'ISSUE', 
           'VOID', 'EXPORT', 'ADMIN'],
    required: true
  }],
  conditions: PermissionConditionsSchema
}, { _id: false });

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    enum: [
      'SYSTEM_ADMIN', 'SALES_MANAGER', 'SALES_ASSOCIATE', 'CASHIER',
      'DELIVERY', 'VIEWER', 'INVENTORY_MANAGER', 'FINANCE_ADMIN'
    ],
    required: true
  },
  displayName: {
    type: String,
    required: true
    // Examples: "Sales Associate", "Sales Manager", "Cashier"
  },
  permissions: [PermissionSchema],
  description: String // Human-readable explanation of responsibilities
}, { _id: false });

const ScheduleDaySchema = new Schema<IScheduleDay>({
  start: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    default: '08:00'
  },
  end: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    default: '17:00'
  },
  isWorkingDay: {
    type: Boolean,
    default: true
  },
  breakStart: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  breakEnd: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
}, { _id: false });

const WorkScheduleSchema = new Schema<IWorkSchedule>({
  monday: { type: ScheduleDaySchema, default: () => ({}) },
  tuesday: { type: ScheduleDaySchema, default: () => ({}) },
  wednesday: { type: ScheduleDaySchema, default: () => ({}) },
  thursday: { type: ScheduleDaySchema, default: () => ({}) },
  friday: { type: ScheduleDaySchema, default: () => ({}) },
  saturday: { 
    type: ScheduleDaySchema, 
    default: () => ({ isWorkingDay: false }) 
  },
  sunday: { 
    type: ScheduleDaySchema, 
    default: () => ({ isWorkingDay: false }) 
  }
}, { _id: false });

const ActivityLogSchema = new Schema<IActivityLog>({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  action: {
    type: String,
    enum: [
      'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_CONFIRMED', 'ORDER_CANCELLED',
      'ORDER_PACKED', 'ORDER_DELIVERED', 'INVOICE_ISSUED', 'INVOICE_PAID',
      'INVOICE_VOIDED', 'QUOTATION_ISSUED', 'QUOTATION_ACCEPTED', 
      'QUOTATION_EXPIRED', 'CASH_SALE_ISSUED', 'PRICE_UPDATED', 
      'PRODUCT_CREATED', 'STOCK_ADJUSTED', 'CLIENT_CREATED', 'CLIENT_UPDATED',
      'CLIENT_CONTACTED', 'LOGIN', 'LOGOUT', 'PERMISSION_CHANGED', 
      'PASSWORD_RESET', 'ITEM_SCANNED', 'PACKAGE_COMPLETED', 
      'DISCREPANCY_NOTED', 'REPORT_GENERATED', 'EXPORT_CREATED', 
      'BACKUP_CREATED'
    ],
    required: true,
    index: true
  },
  resource: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'QUOTATION', 'CASH_SALE', 'PRICE', 'STOCK', 
           'PRODUCT', 'CLIENT', 'STAFF', 'REPORT', 'DASHBOARD', 'PACKAGING', 
           'TIME', 'DOCUMENT'],
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  targetNumber: String,  // e.g., "INV-2024-001234"
  details: {
    previousValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
    metadata: {
      type: Map,
      of: Schema.Types.Mixed
    }
  },
  ipAddress: String,
  userAgent: String,
  duration: Number       // Seconds
}, { _id: true });

const PerformanceMetricsSchema = new Schema<IPerformanceMetrics>({
  ordersCreatedThisMonth: { type: Number, default: 0 },
  ordersProcessedThisMonth: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
  itemsPackedThisMonth: { type: Number, default: 0 },
  averagePackingTimeMinutes: { type: Number, default: 0 },
  documentsIssuedThisMonth: { type: Number, default: 0 },
  documentsVoidedThisMonth: { type: Number, default: 0 },
  errorRatePercent: { type: Number, default: 0 },
  totalRevenueThisMonth: { type: Number, default: 0 },
  totalCollectedThisMonth: { type: Number, default: 0 },
  averageStartTime: String,
  averageEndTime: String,
  activeHoursToday: { type: Number, default: 0 },
  clientComplaints: { type: Number, default: 0 },
  clientCompliments: { type: Number, default: 0 },
  lastCalculatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// ----------------------------------------------------------------------------
// MAIN STAFF SCHEMA
// ----------------------------------------------------------------------------

const StaffSchema = new Schema<IStaff, IStaffModel>({
//const StaffSchema = new Schema<IStaff>({
  // --- Identity ---
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  employeeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^EMP-\d{3,}$/  // EMP-001, EMP-002, etc.
  },
  
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  photo: {
    type: String,
    validate: {
      validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
      message: 'Photo must be a valid URL'
    }
  },

  // --- Role ---
  role: {
    type: RoleSchema,
    required: true,
    default: () => ({
      name: 'VIEWER',
      displayName: 'Viewer',
      permissions: []
    })
  },
  
  customPermissions: [PermissionSchema],

  // In Staff.ts - Fix the schedule field default
  schedule: {
    type: WorkScheduleSchema,
    required: true,
    default: () => ({
      monday: { start: '08:00', end: '17:00', isWorkingDay: true },
      tuesday: { start: '08:00', end: '17:00', isWorkingDay: true },
      wednesday: { start: '08:00', end: '17:00', isWorkingDay: true },
      thursday: { start: '08:00', end: '17:00', isWorkingDay: true },
      friday: { start: '08:00', end: '17:00', isWorkingDay: true },
      saturday: { isWorkingDay: false, start: '09:00', end: '13:00' },
      sunday: { isWorkingDay: false, start: '09:00', end: '13:00' }
    })
  },
  
  timezone: {
    type: String,
    default: 'Africa/Nairobi'
  },

  // --- Activity & Performance ---
  activity: {
    type: [ActivityLogSchema],
    default: []
  },
  
  metrics: {
    type: PerformanceMetricsSchema,
    default: () => ({})
  },

  // --- Status ---
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  joinedAt: {
    type: Date,
    default: Date.now
  },
  
  leftAt: Date,

  // --- Audit ---
  lastLoginAt: Date,
  lastLoginIp: String,
  passwordChangedAt: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

// Activity log queries (recent actions by staff)
StaffSchema.index({ _id: 1, 'activity.timestamp': -1 });

// Activity by resource (who touched what)
StaffSchema.index({ 'activity.targetId': 1, 'activity.resource': 1 });

// Performance queries
StaffSchema.index({ isActive: 1, 'role.name': 1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

/**
 * Full name
 *
StaffSchema.virtual('fullName').get(function(this: IStaff) {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Effective permissions (role + custom)
 *
StaffSchema.virtual('effectivePermissions').get(function(this: IStaff) {
  const rolePerms = this.role.permissions || [];
  const customPerms = this.customPermissions || [];
  
  // Merge, with custom taking precedence
  const merged = [...rolePerms];
  
  for (const custom of customPerms) {
    const existingIndex = merged.findIndex(p => p.resource === custom.resource);
    if (existingIndex >= 0) {
      merged[existingIndex] = custom; // Replace
    } else {
      merged.push(custom);
    }
  }
  
  return merged;
});

/**
 * Is currently working (based on schedule)
 *

// In Staff.ts - Update the isOnSchedule virtual
StaffSchema.virtual('isOnSchedule').get(function(this: IStaff) {
  // Check if schedule exists
  if (!this.schedule) {
    return false; // No schedule defined
  }
  
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayNames[now.getDay()] as keyof IWorkSchedule;
  
  // Safely access schedule with null check
  const schedule = this.schedule?.[today];
  
  if (!schedule || !schedule.isWorkingDay) return false;
  
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= schedule.start && currentTime <= schedule.end;
});

/**
 * Today's activity count
 *
StaffSchema.virtual('todaysActivityCount').get(function(this: IStaff) {
  // Defensive check: ensure activity array exists
  if (!this.activity || !Array.isArray(this.activity)) {
    return 0;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.activity.filter(a => a.timestamp >= today).length;
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

/**
 * Check if staff has permission for action on resource
 *
StaffSchema.methods.hasPermission = function(
  resource: ResourceType,
  action: ActionType,
  context?: { orderValue?: number; isOwnWork?: boolean }
): boolean {
  if (!this.isActive) return false;
  
  const perms = this.effectivePermissions;
  const resourcePerm = perms.find((p: { resource: string; }) => p.resource === resource);
  
  if (!resourcePerm) return false;
  if (!resourcePerm.actions.includes(action)) return false;
  
  // Check conditions
  const conditions = resourcePerm.conditions;
  if (!conditions) return true;
  
  // Max order value check
  if (context?.orderValue && conditions.maxOrderValue !== undefined) {
    if (context.orderValue > conditions.maxOrderValue) return false;
  }
  
  // Cannot approve own work (separation of duties)
  if (action === 'APPROVE' && context?.isOwnWork !== undefined) {
    if (context.isOwnWork && !conditions.canApproveOwn) return false;
  }
  
  return true;
};

/**
 * Log activity - append-only audit trail
 * Called automatically by other modules, never manual
 *
StaffSchema.methods.logActivity = async function(
  action: ActivityAction,
  resource: ResourceType,
  details: {
    targetId?: Types.ObjectId;
    targetNumber?: string;
    previousValue?: any;
    newValue?: any;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
  }
): Promise<void> {
  const logEntry: IActivityLog = {
    timestamp: new Date(),
    action,
    resource,
    targetId: details.targetId,
    targetNumber: details.targetNumber,
    details: {
      previousValue: details.previousValue,
      newValue: details.newValue,
      metadata: details.metadata || {}
    },
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    duration: details.duration
  };
  
  this.activity.push(logEntry);
  
  // Trim activity log to last 90 days to prevent unbounded growth
  /*const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  if (this.activity.length > 1000) {
    this.activity = this.activity.filter((a: { timestamp: number; }) => a.timestamp > ninetyDaysAgo);
  }*

  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000; // number of ms
  if (this.activity.length > 1000) {
    this.activity = this.activity.filter((a: { timestamp: number }) => a.timestamp > ninetyDaysAgo);
  }

  
  await this.save();
};

/**
 * Record login
 *
StaffSchema.methods.recordLogin = function(ipAddress?: string, userAgent?: string): void {
  this.lastLoginAt = new Date();
  this.lastLoginIp = ipAddress;
  this.logActivity('LOGIN', 'STAFF', { ipAddress, userAgent });
};

/**
 * Update performance metrics
 * Called by scheduled job or after significant actions
 *
StaffSchema.methods.recalculateMetrics = async function(): Promise<void> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Filter this month's activity
  //const monthActivity = this.activity.filter((a: { timestamp: number; }) => a.timestamp >= monthStart);
  const monthActivity = this.activity.filter((a: { timestamp: number }) => a.timestamp >= monthStart.getTime());

  
  // Count orders created
  const ordersCreated = monthActivity.filter((a: { action: string; }) => a.action === 'ORDER_CREATED').length;
  
  // Count documents issued
  const docsIssued = monthActivity.filter((a: { action: string; }) => 
    ['INVOICE_ISSUED', 'QUOTATION_ISSUED', 'CASH_SALE_ISSUED'].includes(a.action)
  ).length;
  
  // Count voids (errors)
  const docsVoided = monthActivity.filter((a: { action: string; }) => a.action === 'INVOICE_VOIDED').length;
  
  // Calculate error rate
  const errorRate = docsIssued > 0 ? (docsVoided / docsIssued) * 100 : 0;
  
  // Calculate average packing time (from ORDER_PACKED actions with duration)
  const packingActions = monthActivity.filter((a: { action: string; duration: any; }) => 
    a.action === 'ORDER_PACKED' && a.duration
  );
  const avgPackingTime = packingActions.length > 0
    ? packingActions.reduce((sum: any, a: { duration: any; }) => sum + (a.duration || 0), 0) / packingActions.length / 60
    : 0;
  
  // Update metrics
  this.metrics.ordersCreatedThisMonth = ordersCreated;
  this.metrics.documentsIssuedThisMonth = docsIssued;
  this.metrics.documentsVoidedThisMonth = docsVoided;
  this.metrics.errorRatePercent = Math.round(errorRate * 100) / 100;
  this.metrics.averagePackingTimeMinutes = Math.round(avgPackingTime * 100) / 100;
  this.metrics.lastCalculatedAt = now;
  
  await this.save();
};

/**
 * Get recent activity (last N days)
 */
/*StaffSchema.methods.getRecentActivity = function(days: number = 7): IActivityLog[] {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.activity
    .filter((a: { timestamp: number; }) => a.timestamp >= cutoff)
    .sort((a: { timestamp: { getTime: () => number; }; }, b: { timestamp: { getTime: () => number; }; }) => b.timestamp.getTime() - a.timestamp.getTime());
};*

StaffSchema.methods.getRecentActivity = function(days: number = 7): IActivityLog[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000; // number in ms
  return this.activity
    .filter((a: { timestamp: number }) => a.timestamp >= cutoff) // compare number vs number
    .sort((a: { timestamp: number; }, b: { timestamp: number; }) => b.timestamp - a.timestamp);                  // sort numbers
};


/**
 * Check if staff can approve specific order/document
 *
StaffSchema.methods.canApprove = function(
  documentType: 'ORDER' | 'INVOICE',
  value: number,
  isOwnWork: boolean
): { allowed: boolean; reason?: string } {
  const resource = documentType === 'ORDER' ? 'ORDER' : 'INVOICE';
  
  if (!this.hasPermission(resource, 'APPROVE', { orderValue: value, isOwnWork })) {
    if (isOwnWork) {
      return { allowed: false, reason: 'Cannot approve your own work (separation of duties)' };
    }
    if (value > (this.role.permissions.find((p: { resource: string; }) => p.resource === resource)?.conditions?.maxOrderValue || 0)) {
      return { allowed: false, reason: `Value exceeds your approval limit` };
    }
    return { allowed: false, reason: 'Insufficient permissions' };
  }
  
  return { allowed: true };
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Get staff by user ID (for auth middleware)
 *
StaffSchema.statics.findByUser = function(userId: Types.ObjectId) {
  return this.findOne({ user: userId, isActive: true });
};

/**
 * Get all staff with specific permission
 *
StaffSchema.statics.findWithPermission = function(
  resource: ResourceType,
  action: ActionType
) {
  return this.find({
    isActive: true,
    $or: [
      { 'role.permissions.resource': resource, 'role.permissions.actions': action },
      { 'customPermissions.resource': resource, 'customPermissions.actions': action }
    ]
  });
};

/**
 * Get activity report for date range
 *
StaffSchema.statics.getActivityReport = async function(
  startDate: Date,
  endDate: Date,
  staffId?: Types.ObjectId
) {
  const match: any = {
    isActive: true,
    'activity.timestamp': { $gte: startDate, $lte: endDate }
  };
  
  if (staffId) {
    match._id = staffId;
  }
  
  return this.aggregate([
    { $match: match },
    { $unwind: '$activity' },
    { $match: { 'activity.timestamp': { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: {
          staff: '$_id',
          name: { $concat: ['$firstName', ' ', '$lastName'] },
          action: '$activity.action'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.staff',
        name: { $first: '$_id.name' },
        actions: {
          $push: {
            action: '$_id.action',
            count: '$count'
          }
        },
        totalActions: { $sum: '$count' }
      }
    },
    { $sort: { totalActions: -1 } }
  ]);
};

/**
 * Create staff with role template
 *
StaffSchema.statics.createWithRole = async function(
  userId: Types.ObjectId,
  employeeId: string,
  personalInfo: { firstName: string; lastName: string; email: string; phone: string },
  roleName: RoleName
): Promise<IStaff> {
  // Predefined role templates
  const roleTemplates: Record<RoleName, IRole> = {
 
    'SALES_ASSOCIATE': {
      name: 'SALES_ASSOCIATE',
      displayName: 'Sales Associate',
      description: 'Creates orders, issues invoices/quotations, manages client relationships. Can modify prices with limits. Cannot approve own work.',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['CREATE', 'READ', 'UPDATE'],
          conditions: { maxOrderValue: 50000, canApproveOwn: false }
        },
        {
          resource: 'INVOICE',
          actions: ['CREATE', 'READ', 'ISSUE'],
          conditions: { maxOrderValue: 50000 }
        },
        {
          resource: 'QUOTATION',
          actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE']
        },
        {
          resource: 'CLIENT',
          actions: ['CREATE', 'READ', 'UPDATE']
        },
        {
          resource: 'PRICE',
          actions: ['READ', 'UPDATE'],
          conditions: { canChangePrices: true, maxDiscountPercent: 10 }
        },
        {
          resource: 'PRODUCT',
          actions: ['READ']
        },
        {
          resource: 'PACKAGING',
          actions: ['READ', 'UPDATE'] // Can scan items
        }
      ]
  },
  
  'SALES_MANAGER': {
    name: 'SALES_MANAGER',
    displayName: 'Sales Manager',
    description: 'Approves large orders, manages inventory and suppliers, overrides price limits.',
    permissions: [
      {
        resource: 'ORDER',
        actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE'],
        conditions: { maxOrderValue: 200000, canApproveOwn: false }
      },
      {
        resource: 'INVOICE',
        actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE', 'APPROVE', 'VOID'],
        conditions: { maxOrderValue: 200000 }
      },
      {
        resource: 'PRODUCT',
        actions: ['CREATE', 'READ', 'UPDATE']
      },
      {
        resource: 'STOCK',
        actions: ['CREATE', 'READ', 'UPDATE']
      },
      {
        resource: 'PRICE',
        actions: ['READ', 'UPDATE'],
        conditions: { canChangePrices: true } // No discount limit
      },
      {
        resource: 'SUPPLIER',
        actions: ['CREATE', 'READ', 'UPDATE']
      }
    ]
  },
  
  'CASHIER': {
    name: 'CASHIER',
    displayName: 'Cashier',
    description: 'Processes immediate payments, cash sales, and financial reports. Can record payments on invoices.',
    permissions: [
      {
        resource: 'CASH_SALE',
        actions: ['CREATE', 'READ', 'ISSUE']
      },
      {
        resource: 'INVOICE',
        actions: ['READ', 'UPDATE'], // Record payments
        conditions: { canModifyLocked: true } // Can add payments to locked invoices
      },
      {
        resource: 'REPORT',
        actions: ['READ', 'EXPORT', 'CREATE']
      },
      {
        resource: 'DASHBOARD',
        actions: ['READ']
      }
    ]
  },
    'SYSTEM_ADMIN': {
      name: 'SYSTEM_ADMIN',
      displayName: 'System Administrator',
      description: 'Full system access',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE']
        },
        {
          resource: 'INVOICE',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE', 'APPROVE', 'VOID']
        },
        {
          resource: 'STAFF',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN']
        },
        {
          resource: 'REPORT',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT']
        }
      ]
    },
    'DELIVERY': {
      name: 'DELIVERY',
      displayName: 'Delivery Personnel',
      description: 'Field delivery, proof of delivery',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['READ', 'UPDATE'], // Update delivery status
          conditions: { allowedCategories: ['deliverable'] }
        },
        {
          resource: 'PACKAGING',
          actions: ['READ']
        }
      ]
    },
    'VIEWER': {
      name: 'VIEWER',
      displayName: 'Read-Only Access',
      description: 'View-only access for auditing',
      permissions: [
        { resource: 'ORDER', actions: ['READ'] },
        { resource: 'INVOICE', actions: ['READ'] },
        { resource: 'REPORT', actions: ['READ'] }
      ]
    }
  };
  
  const role = roleTemplates[roleName];
  if (!role) throw new Error(`Unknown role: ${roleName}`);
  
  const staff = new this({
    user: userId,
    employeeId,
    ...personalInfo,
    role
  });
  
  return staff.save();
};

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Validate role structure
 *

// In Staff.ts - Add this pre-save middleware
StaffSchema.pre('save', function(next) {
  // Ensure schedule exists
  if (!this.schedule) {
    this.schedule = {
      monday: { start: '08:00', end: '17:00', isWorkingDay: true },
      tuesday: { start: '08:00', end: '17:00', isWorkingDay: true },
      wednesday: { start: '08:00', end: '17:00', isWorkingDay: true },
      thursday: { start: '08:00', end: '17:00', isWorkingDay: true },
      friday: { start: '08:00', end: '17:00', isWorkingDay: true },
      saturday: { isWorkingDay: false, start: '09:00', end: '13:00' },
      sunday: { isWorkingDay: false, start: '09:00', end: '13:00' }
    };
  }
  
  // Ensure each day has required fields
  const days: (keyof IWorkSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (const day of days) {
    if (!this.schedule[day]) {
      this.schedule[day] = {
        start: '09:00',
        end: '17:00',
        isWorkingDay: day !== 'saturday' && day !== 'sunday'
      };
    }
    
    // Ensure each day has start/end even if not working
    if (!this.schedule[day].start) this.schedule[day].start = '09:00';
    if (!this.schedule[day].end) this.schedule[day].end = '17:00';
    if (this.schedule[day].isWorkingDay === undefined) {
      this.schedule[day].isWorkingDay = day !== 'saturday' && day !== 'sunday';
    }
  }

});


// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
export default Staff;

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * PERMISSION CHECK IN API ROUTE:
 * 
 * // Middleware to check permissions
 * const requirePermission = (resource: ResourceType, action: ActionType) => {
 *   return async (req: Request, res: Response, next: NextFunction) => {
 *     const staff = await Staff.findByUser(req.user._id);
 *     
 *     const orderValue = req.body.total || 0;
 *     const isOwnWork = req.body.createdBy?.toString() === staff._id.toString();
 *     
 *     if (!staff.hasPermission(resource, action, { orderValue, isOwnWork })) {
 *       return res.status(403).json({ error: 'Insufficient permissions' });
 *     }
 *     
 *     req.staff = staff; // Attach for activity logging
 *     next();
 *   };
 * };
 * 
 * // Use in routes
 * app.post('/api/orders', 
 *   requirePermission('ORDER', 'CREATE'), 
 *   createOrder
 * );
 */

/**
 * AUTO-LOGGING FROM ORDER MODULE:
 * 
 * // In Order.create()
 * await staff.logActivity('ORDER_CREATED', 'ORDER', {
 *   targetId: order._id,
 *   targetNumber: order.orderNumber,
 *   newValue: { total: order.total, itemCount: order.items.length },
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent']
 * });
 * 
 * // In Order.confirm()
 * await staff.logActivity('ORDER_CONFIRMED', 'ORDER', {
 *   targetId: order._id,
 *   targetNumber: order.orderNumber,
 *   previousValue: 'DRAFT',
 *   newValue: 'CONFIRMED'
 * });
 */

/**
 * ACTIVITY-BASED TIME TRACKING:
 * 
 * // No manual clock-in! Derive from activity patterns
 * const today = new Date();
 * const todaysLogs = staff.activity.filter(a => 
 *   a.timestamp >= new Date(today.setHours(0,0,0,0))
 * );
 * 
 * if (todaysLogs.length > 0) {
 *   const firstActivity = todaysLogs[0].timestamp;
 *   const lastActivity = todaysLogs[todaysLogs.length - 1].timestamp;
 *   
 *   console.log(`Effective work hours: ${firstActivity.toLocaleTimeString()} - ${lastActivity.toLocaleTimeString()}`);
 * }
 */

/**
 * PERFORMANCE DASHBOARD:
 * 
 * // Get all staff metrics
 * const staffMetrics = await Staff.find({ isActive: true })
 *   .select('firstName lastName role.name metrics');
 * 
 * // Identify top performers
 * const topSales = staffMetrics.sort((a, b) => 
 *   b.metrics.ordersCreatedThisMonth - a.metrics.ordersCreatedThisMonth
 * );
 * 
 * // Identify issues (high error rates)
 * const problemStaff = staffMetrics.filter(s => s.metrics.errorRatePercent > 5);
 */

/**
 * SEPARATION OF DUTIES ENFORCEMENT:
 * 
 * // Jacky creates order
 * const jacky = await Staff.findOne({ 'role.name': 'JACKY' });
 * const order = await Order.create({...});
 * await jacky.logActivity('ORDER_CREATED', 'ORDER', { targetId: order._id });
 * 
 * // Jacky CANNOT approve her own order (canApproveOwn: false)
 * const canApprove = jacky.canApprove('ORDER', order.total, true);
 * // Returns: { allowed: false, reason: 'Cannot approve your own work' }
 * 
 * // Gilbert approves instead
 * const gilbert = await Staff.findOne({ 'role.name': 'GILBERT' });
 * if (gilbert.canApprove('ORDER', order.total, false).allowed) {
 *   await order.approve(gilbert._id);
 *   await gilbert.logActivity('ORDER_APPROVED', 'ORDER', { targetId: order._id });
 * }
 */

// ============================================================================
// STAFF MODULE
// ============================================================================
// Core Purpose: Identity, permissions, and automatic activity tracking
// Interconnections:
//   - Links to User (authentication)
//   - Activity logs auto-generated from Orders, Documents, Price List actions
//   - Time Management derived from activity patterns (no manual clock-in)
//   - Dashboard aggregates performance metrics
//   - Permissions enforce business rules (approval limits, separation of duties)
// ============================================================================

import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * System resources that can be protected
 */
export type ResourceType = 
  | 'ORDER' 
  | 'INVOICE' 
  | 'QUOTATION' 
  | 'CASH_SALE'
  | 'PRICE' 
  | 'STOCK' 
  | 'PRODUCT'
  | 'CLIENT'
  | 'STAFF'
  | 'REPORT'
  | 'DASHBOARD'
  | 'PACKAGING'
  | 'TIME'
  | 'DOCUMENT'
  | 'SUPPLIER';

/**
 * CRUD + approval actions
 */
export type ActionType = 
  | 'CREATE' 
  | 'READ' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'APPROVE'
  | 'ISSUE'
  | 'VOID'
  | 'EXPORT'
  | 'ADMIN';

/**
 * Named roles matching actual team structure
 */
export type RoleName = 
  | 'SYSTEM_ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_ASSOCIATE'
  | 'CASHIER'
  | 'DELIVERY'
  | 'VIEWER';

/**
 * Permission conditions - granular control
 */
export interface IPermissionConditions {
  maxOrderValue?: number;
  maxDiscountPercent?: number;
  canChangePrices?: boolean;
  canApproveOwn?: boolean;
  canModifyLocked?: boolean;
  requiresDualApproval?: boolean;
  allowedCategories?: string[];
  allowedClients?: string[];
}

/**
 * Individual permission grant
 */
export interface IPermission {
  resource: ResourceType;
  actions: ActionType[];
  conditions?: IPermissionConditions;
}

/**
 * Role definition with permissions
 */
export interface IRole {
  name: RoleName;
  displayName: string;
  permissions: IPermission[];
  description?: string;
}

/**
 * Daily schedule entry
 */
export interface IScheduleDay {
  start: string;
  end: string;
  isWorkingDay: boolean;
  breakStart?: string;
  breakEnd?: string;
}

/**
 * Weekly schedule
 */
export interface IWorkSchedule {
  monday: IScheduleDay;
  tuesday: IScheduleDay;
  wednesday: IScheduleDay;
  thursday: IScheduleDay;
  friday: IScheduleDay;
  saturday: IScheduleDay;
  sunday: IScheduleDay;
}

/**
 * Activity log entry
 */
export interface IActivityLog {
  timestamp: Date;
  action: ActivityAction;
  resource: ResourceType;
  targetId?: Types.ObjectId;
  targetNumber?: string;
  details: {
    previousValue?: any;
    newValue?: any;
    metadata?: Record<string, any>;
  };
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
}

/**
 * Specific actions that can be logged
 */
export type ActivityAction = 
  | 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_CONFIRMED' 
  | 'ORDER_CANCELLED' | 'ORDER_PACKED' | 'ORDER_DELIVERED'
  | 'INVOICE_ISSUED' | 'INVOICE_PAID' | 'INVOICE_VOIDED'
  | 'QUOTATION_ISSUED' | 'QUOTATION_ACCEPTED' | 'QUOTATION_EXPIRED'
  | 'CASH_SALE_ISSUED'
  | 'PRICE_UPDATED' | 'PRODUCT_CREATED' | 'STOCK_ADJUSTED'
  | 'CLIENT_CREATED' | 'CLIENT_UPDATED' | 'CLIENT_CONTACTED'
  | 'LOGIN' | 'LOGOUT' | 'PERMISSION_CHANGED' | 'PASSWORD_RESET'
  | 'ITEM_SCANNED' | 'PACKAGE_COMPLETED' | 'DISCREPANCY_NOTED'
  | 'REPORT_GENERATED' | 'EXPORT_CREATED' | 'BACKUP_CREATED'
  | 'STAFF_CREATED' | 'SCHEDULE_UPDATED' | 'STAFF_UPDATED' | 'STAFF_DEACTIVATED';

/**
 * Performance metrics
 */
export interface IPerformanceMetrics {
  ordersCreatedThisMonth: number;
  ordersProcessedThisMonth: number;
  averageOrderValue: number;
  itemsPackedThisMonth: number;
  averagePackingTimeMinutes: number;
  documentsIssuedThisMonth: number;
  documentsVoidedThisMonth: number;
  errorRatePercent: number;
  totalRevenueThisMonth: number;
  totalCollectedThisMonth: number;
  averageStartTime?: string;
  averageEndTime?: string;
  activeHoursToday: number;
  clientComplaints: number;
  clientCompliments: number;
  lastCalculatedAt: Date;
}

// ----------------------------------------------------------------------------
// STAFF INTERFACE WITH METHODS
// ----------------------------------------------------------------------------

/**
 * Staff document interface with instance methods
 */
export interface IStaff extends Document {
  // --- Identity ---
  user: Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
  
  // --- Role & Permissions ---
  role: IRole;
  customPermissions?: IPermission[];
  
  // --- Schedule ---
  schedule: IWorkSchedule;
  timezone: string;
  
  // --- Activity & Performance ---
  activity: IActivityLog[];
  metrics: IPerformanceMetrics;
  
  // --- Status ---
  isActive: boolean;
  joinedAt: Date;
  leftAt?: Date;
  
  // --- Audit ---
  lastLoginAt?: Date;
  lastLoginIp?: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // --- Virtuals ---
  fullName: string;
  effectivePermissions: IPermission[];
  isOnSchedule: boolean;
  todaysActivityCount: number;

  // --- Instance Methods ---
  hasPermission(
    resource: ResourceType,
    action: ActionType,
    context?: { orderValue?: number; isOwnWork?: boolean }
  ): boolean;
  
  logActivity(
    action: ActivityAction,
    resource: ResourceType,
    details: {
      targetId?: Types.ObjectId;
      targetNumber?: string;
      previousValue?: any;
      newValue?: any;
      metadata?: Record<string, any>;
      ipAddress?: string;
      userAgent?: string;
      duration?: number;
    }
  ): Promise<void>;
  
  recordLogin(ipAddress?: string, userAgent?: string): void;
  recalculateMetrics(): Promise<void>;
  getRecentActivity(days?: number): IActivityLog[];
  canApprove(
    documentType: 'ORDER' | 'INVOICE',
    value: number,
    isOwnWork: boolean
  ): { allowed: boolean; reason?: string };
}

// ----------------------------------------------------------------------------
// STAFF MODEL INTERFACE WITH STATICS
// ----------------------------------------------------------------------------

/**
 * Staff model interface with static methods
 */
export interface IStaffModel extends Model<IStaff> {
  createWithRole(
    userId: Types.ObjectId,
    employeeId: string,
    personalInfo: { firstName: string; lastName: string; email: string; phone: string },
    roleName: RoleName
  ): Promise<IStaff>;
  
  findByUser(userId: Types.ObjectId): Promise<IStaff | null>;
  
  findWithPermission(
    resource: ResourceType,
    action: ActionType
  ): Promise<IStaff[]>;
  
  getActivityReport(
    startDate: Date,
    endDate: Date,
    staffId?: Types.ObjectId
  ): Promise<any[]>;
}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const PermissionConditionsSchema = new Schema<IPermissionConditions>({
  maxOrderValue: Number,
  maxDiscountPercent: {
    type: Number,
    min: 0,
    max: 100
  },
  canChangePrices: Boolean,
  canApproveOwn: {
    type: Boolean,
    default: false
  },
  canModifyLocked: Boolean,
  requiresDualApproval: Boolean,
  allowedCategories: [String],
  allowedClients: [String]
}, { _id: false });

const PermissionSchema = new Schema<IPermission>({
  resource: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'QUOTATION', 'CASH_SALE', 'PRICE', 'STOCK', 
           'PRODUCT', 'CLIENT', 'STAFF', 'REPORT', 'DASHBOARD', 'PACKAGING', 
           'TIME', 'DOCUMENT', 'SUPPLIER'],
    required: true
  },
  actions: [{
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'ISSUE', 
           'VOID', 'EXPORT', 'ADMIN'],
    required: true
  }],
  conditions: PermissionConditionsSchema
}, { _id: false });

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    enum: ['SYSTEM_ADMIN', 'SALES_MANAGER', 'SALES_ASSOCIATE', 'CASHIER',
           'DELIVERY', 'VIEWER'],
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  permissions: [PermissionSchema],
  description: String
}, { _id: false });

const ScheduleDaySchema = new Schema<IScheduleDay>({
  start: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    default: '09:00'
  },
  end: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    default: '17:00'
  },
  isWorkingDay: {
    type: Boolean,
    default: true
  },
  breakStart: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  breakEnd: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
}, { _id: false });

const WorkScheduleSchema = new Schema<IWorkSchedule>({
  monday: { type: ScheduleDaySchema, default: () => ({}) },
  tuesday: { type: ScheduleDaySchema, default: () => ({}) },
  wednesday: { type: ScheduleDaySchema, default: () => ({}) },
  thursday: { type: ScheduleDaySchema, default: () => ({}) },
  friday: { type: ScheduleDaySchema, default: () => ({}) },
  saturday: { type: ScheduleDaySchema, default: () => ({ isWorkingDay: false }) },
  sunday: { type: ScheduleDaySchema, default: () => ({ isWorkingDay: false }) }
}, { _id: false });

const ActivityLogSchema = new Schema<IActivityLog>({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  action: {
    type: String,
    enum: [
      'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_CONFIRMED', 'ORDER_CANCELLED',
      'ORDER_PACKED', 'ORDER_DELIVERED', 'INVOICE_ISSUED', 'INVOICE_PAID',
      'INVOICE_VOIDED', 'QUOTATION_ISSUED', 'QUOTATION_ACCEPTED', 
      'QUOTATION_EXPIRED', 'CASH_SALE_ISSUED', 'PRICE_UPDATED', 
      'PRODUCT_CREATED', 'STOCK_ADJUSTED', 'CLIENT_CREATED', 'CLIENT_UPDATED',
      'CLIENT_CONTACTED', 'LOGIN', 'LOGOUT', 'PERMISSION_CHANGED', 
      'PASSWORD_RESET', 'ITEM_SCANNED', 'PACKAGE_COMPLETED', 
      'DISCREPANCY_NOTED', 'REPORT_GENERATED', 'EXPORT_CREATED', 
      'BACKUP_CREATED', 'STAFF_CREATED'
    ],
    required: true,
    index: true
  },
  resource: {
    type: String,
    enum: ['ORDER', 'INVOICE', 'QUOTATION', 'CASH_SALE', 'PRICE', 'STOCK', 
           'PRODUCT', 'CLIENT', 'STAFF', 'REPORT', 'DASHBOARD', 'PACKAGING', 
           'TIME', 'DOCUMENT', 'SUPPLIER'],
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  targetNumber: String,
  details: {
    previousValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
    metadata: {
      type: Map,
      of: Schema.Types.Mixed
    }
  },
  ipAddress: String,
  userAgent: String,
  duration: Number
}, { _id: true });

const PerformanceMetricsSchema = new Schema<IPerformanceMetrics>({
  ordersCreatedThisMonth: { type: Number, default: 0 },
  ordersProcessedThisMonth: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
  itemsPackedThisMonth: { type: Number, default: 0 },
  averagePackingTimeMinutes: { type: Number, default: 0 },
  documentsIssuedThisMonth: { type: Number, default: 0 },
  documentsVoidedThisMonth: { type: Number, default: 0 },
  errorRatePercent: { type: Number, default: 0 },
  totalRevenueThisMonth: { type: Number, default: 0 },
  totalCollectedThisMonth: { type: Number, default: 0 },
  averageStartTime: String,
  averageEndTime: String,
  activeHoursToday: { type: Number, default: 0 },
  clientComplaints: { type: Number, default: 0 },
  clientCompliments: { type: Number, default: 0 },
  lastCalculatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// ----------------------------------------------------------------------------
// MAIN STAFF SCHEMA
// ----------------------------------------------------------------------------

const StaffSchema = new Schema<IStaff, IStaffModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  employeeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^EMP-\d{3,}$/
  },
  
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  photo: {
    type: String,
    validate: {
      validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
      message: 'Photo must be a valid URL'
    }
  },

  role: {
    type: RoleSchema,
    required: true,
    default: () => ({
      name: 'VIEWER',
      displayName: 'Viewer',
      permissions: []
    })
  },
  
  customPermissions: [PermissionSchema],

  schedule: {
    type: WorkScheduleSchema,
    required: true,
    default: () => ({
      monday: { start: '09:00', end: '17:00', isWorkingDay: true },
      tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
      wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
      thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
      friday: { start: '09:00', end: '17:00', isWorkingDay: true },
      saturday: { start: '09:00', end: '13:00', isWorkingDay: false },
      sunday: { start: '09:00', end: '13:00', isWorkingDay: false }
    })
  },
  
  timezone: {
    type: String,
    default: 'Africa/Nairobi'
  },

  activity: {
    type: [ActivityLogSchema],
    default: []
  },
  
  metrics: {
    type: PerformanceMetricsSchema,
    default: () => ({})
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  joinedAt: {
    type: Date,
    default: Date.now
  },
  
  leftAt: Date,

  lastLoginAt: Date,
  lastLoginIp: String,
  passwordChangedAt: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// INDEXES
// ----------------------------------------------------------------------------

StaffSchema.index({ _id: 1, 'activity.timestamp': -1 });
StaffSchema.index({ 'activity.targetId': 1, 'activity.resource': 1 });
StaffSchema.index({ isActive: 1, 'role.name': 1 });

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

StaffSchema.virtual('fullName').get(function(this: IStaff) {
  return `${this.firstName} ${this.lastName}`;
});

StaffSchema.virtual('effectivePermissions').get(function(this: IStaff) {
  const rolePerms = this.role.permissions || [];
  const customPerms = this.customPermissions || [];
  
  const merged = [...rolePerms];
  
  for (const custom of customPerms) {
    const existingIndex = merged.findIndex(p => p.resource === custom.resource);
    if (existingIndex >= 0) {
      merged[existingIndex] = custom;
    } else {
      merged.push(custom);
    }
  }
  
  return merged;
});

StaffSchema.virtual('isOnSchedule').get(function(this: IStaff) {
  if (!this.schedule) return false;
  
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayNames[now.getDay()] as keyof IWorkSchedule;
  
  const schedule = this.schedule?.[today];
  if (!schedule || !schedule.isWorkingDay) return false;
  
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= schedule.start && currentTime <= schedule.end;
});

StaffSchema.virtual('todaysActivityCount').get(function(this: IStaff) {
  if (!this.activity || !Array.isArray(this.activity)) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  
  return this.activity.filter(a => {
    const timestamp = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    return timestamp >= todayTime;
  }).length;
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

StaffSchema.methods.hasPermission = function(
  resource: ResourceType,
  action: ActionType,
  context?: { orderValue?: number; isOwnWork?: boolean }
): boolean {
  if (!this.isActive) return false;
  
  const perms = this.effectivePermissions;
  const resourcePerm = perms.find((p: IPermission) => p.resource === resource);
  
  if (!resourcePerm) return false;
  if (!resourcePerm.actions.includes(action)) return false;
  
  const conditions = resourcePerm.conditions;
  if (!conditions) return true;
  
  if (context?.orderValue && conditions.maxOrderValue !== undefined) {
    if (context.orderValue > conditions.maxOrderValue) return false;
  }
  
  if (action === 'APPROVE' && context?.isOwnWork !== undefined) {
    if (context.isOwnWork && !conditions.canApproveOwn) return false;
  }
  
  return true;
};

StaffSchema.methods.logActivity = async function(
  action: ActivityAction,
  resource: ResourceType,
  details: {
    targetId?: Types.ObjectId;
    targetNumber?: string;
    previousValue?: any;
    newValue?: any;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
  }
): Promise<void> {
  const logEntry: IActivityLog = {
    timestamp: new Date(),
    action,
    resource,
    targetId: details.targetId,
    targetNumber: details.targetNumber,
    details: {
      previousValue: details.previousValue,
      newValue: details.newValue,
      metadata: details.metadata || {}
    },
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    duration: details.duration
  };
  
  this.activity.push(logEntry);
  
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  if (this.activity.length > 1000) {
    this.activity = this.activity.filter((a: IActivityLog) => 
      new Date(a.timestamp).getTime() > ninetyDaysAgo
    );
  }
  
  await this.save();
};

StaffSchema.methods.recordLogin = function(ipAddress?: string, userAgent?: string): void {
  this.lastLoginAt = new Date();
  this.lastLoginIp = ipAddress;
  this.logActivity('LOGIN', 'STAFF', { ipAddress, userAgent, metadata: { type: 'login' } });
};

StaffSchema.methods.recalculateMetrics = async function(): Promise<void> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  
  const monthActivity = this.activity.filter((a: IActivityLog) => 
    new Date(a.timestamp).getTime() >= monthStart
  );
  
  const ordersCreated = monthActivity.filter((a: IActivityLog) => a.action === 'ORDER_CREATED').length;
  
  const docsIssued = monthActivity.filter((a: IActivityLog) => 
    ['INVOICE_ISSUED', 'QUOTATION_ISSUED', 'CASH_SALE_ISSUED'].includes(a.action)
  ).length;
  
  const docsVoided = monthActivity.filter((a: IActivityLog) => a.action === 'INVOICE_VOIDED').length;
  
  const errorRate = docsIssued > 0 ? (docsVoided / docsIssued) * 100 : 0;
  
  const packingActions = monthActivity.filter((a: IActivityLog) => 
    a.action === 'ORDER_PACKED' && a.duration
  );
  const avgPackingTime = packingActions.length > 0
    ? packingActions.reduce((sum: number, a: IActivityLog) => sum + (a.duration || 0), 0) / packingActions.length / 60
    : 0;
  
  this.metrics.ordersCreatedThisMonth = ordersCreated;
  this.metrics.documentsIssuedThisMonth = docsIssued;
  this.metrics.documentsVoidedThisMonth = docsVoided;
  this.metrics.errorRatePercent = Math.round(errorRate * 100) / 100;
  this.metrics.averagePackingTimeMinutes = Math.round(avgPackingTime * 100) / 100;
  this.metrics.lastCalculatedAt = now;
  
  await this.save();
};

StaffSchema.methods.getRecentActivity = function(days: number = 7): IActivityLog[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return this.activity
    .filter((a: IActivityLog) => new Date(a.timestamp).getTime() >= cutoff)
    .sort((a: IActivityLog, b: IActivityLog) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

StaffSchema.methods.canApprove = function(
  documentType: 'ORDER' | 'INVOICE',
  value: number,
  isOwnWork: boolean
): { allowed: boolean; reason?: string } {
  const resource = documentType === 'ORDER' ? 'ORDER' : 'INVOICE';
  
  if (!this.hasPermission(resource, 'APPROVE', { orderValue: value, isOwnWork })) {
    if (isOwnWork) {
      return { allowed: false, reason: 'Cannot approve your own work (separation of duties)' };
    }
    
    const resourcePerm = this.effectivePermissions.find((p: IPermission) => p.resource === resource);
    if (resourcePerm?.conditions?.maxOrderValue && value > resourcePerm.conditions.maxOrderValue) {
      return { allowed: false, reason: `Value exceeds your approval limit of ${resourcePerm.conditions.maxOrderValue}` };
    }
    
    return { allowed: false, reason: 'Insufficient permissions' };
  }
  
  return { allowed: true };
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

StaffSchema.statics.findByUser = function(userId: Types.ObjectId) {
  return this.findOne({ user: userId, isActive: true });
};

StaffSchema.statics.findWithPermission = function(
  resource: ResourceType,
  action: ActionType
) {
  return this.find({
    isActive: true,
    $or: [
      { 'role.permissions': { $elemMatch: { resource, actions: action } } },
      { 'customPermissions': { $elemMatch: { resource, actions: action } } }
    ]
  });
};

StaffSchema.statics.getActivityReport = async function(
  startDate: Date,
  endDate: Date,
  staffId?: Types.ObjectId
) {
  const match: any = {
    isActive: true
  };
  
  if (staffId) {
    match._id = staffId;
  }
  
  return this.aggregate([
    { $match: match },
    { $unwind: '$activity' },
    { 
      $match: { 
        'activity.timestamp': { 
          $gte: startDate, 
          $lte: endDate 
        } 
      } 
    },
    {
      $group: {
        _id: {
          staff: '$_id',
          name: { $concat: ['$firstName', ' ', '$lastName'] },
          action: '$activity.action',
          resource: '$activity.resource'
        },
        count: { $sum: 1 },
        lastOccurrence: { $max: '$activity.timestamp' }
      }
    },
    {
      $group: {
        _id: '$_id.staff',
        name: { $first: '$_id.name' },
        actions: {
          $push: {
            action: '$_id.action',
            resource: '$_id.resource',
            count: '$count',
            lastOccurrence: '$lastOccurrence'
          }
        },
        totalActions: { $sum: '$count' }
      }
    },
    { $sort: { totalActions: -1 } }
  ]);
};

StaffSchema.statics.createWithRole = async function(
  userId: Types.ObjectId,
  employeeId: string,
  personalInfo: { firstName: string; lastName: string; email: string; phone: string },
  roleName: RoleName
): Promise<IStaff> {
  const roleTemplates: Record<RoleName, IRole> = {
    'SYSTEM_ADMIN': {
      name: 'SYSTEM_ADMIN',
      displayName: 'System Administrator',
      description: 'Full system access with user management capabilities',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'VOID']
        },
        {
          resource: 'INVOICE',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE', 'APPROVE', 'VOID']
        },
        {
          resource: 'QUOTATION',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE']
        },
        {
          resource: 'CASH_SALE',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE', 'VOID']
        },
        {
          resource: 'PRICE',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          conditions: { canChangePrices: true }
        },
        {
          resource: 'STOCK',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
        },
        {
          resource: 'PRODUCT',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
        },
        {
          resource: 'CLIENT',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
        },
        {
          resource: 'STAFF',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN']
        },
        {
          resource: 'REPORT',
          actions: ['CREATE', 'READ', 'EXPORT']
        },
        {
          resource: 'DASHBOARD',
          actions: ['READ']
        },
        {
          resource: 'PACKAGING',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
        },
        {
          resource: 'DOCUMENT',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
        },
        {
          resource: 'SUPPLIER',
          actions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
        }
      ]
    },
    
    'SALES_MANAGER': {
      name: 'SALES_MANAGER',
      displayName: 'Sales Manager',
      description: 'Approves large orders, manages inventory and suppliers, overrides price limits',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['CREATE', 'READ', 'UPDATE', 'APPROVE'],
          conditions: { maxOrderValue: 200000, canApproveOwn: false }
        },
        {
          resource: 'INVOICE',
          actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE', 'APPROVE', 'VOID'],
          conditions: { maxOrderValue: 200000 }
        },
        {
          resource: 'QUOTATION',
          actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE']
        },
        {
          resource: 'CASH_SALE',
          actions: ['CREATE', 'READ']
        },
        {
          resource: 'PRICE',
          actions: ['READ', 'UPDATE'],
          conditions: { canChangePrices: true }
        },
        {
          resource: 'STOCK',
          actions: ['CREATE', 'READ', 'UPDATE']
        },
        {
          resource: 'PRODUCT',
          actions: ['CREATE', 'READ', 'UPDATE']
        },
        {
          resource: 'CLIENT',
          actions: ['CREATE', 'READ', 'UPDATE']
        },
        {
          resource: 'REPORT',
          actions: ['READ', 'EXPORT']
        },
        {
          resource: 'DASHBOARD',
          actions: ['READ']
        },
        {
          resource: 'SUPPLIER',
          actions: ['CREATE', 'READ', 'UPDATE']
        }
      ]
    },
    
    'SALES_ASSOCIATE': {
      name: 'SALES_ASSOCIATE',
      displayName: 'Sales Associate',
      description: 'Creates orders, issues invoices/quotations, manages client relationships',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['CREATE', 'READ', 'UPDATE'],
          conditions: { maxOrderValue: 50000, canApproveOwn: false }
        },
        {
          resource: 'INVOICE',
          actions: ['CREATE', 'READ', 'ISSUE'],
          conditions: { maxOrderValue: 50000 }
        },
        {
          resource: 'QUOTATION',
          actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE']
        },
        {
          resource: 'CASH_SALE',
          actions: ['CREATE', 'READ']
        },
        {
          resource: 'PRICE',
          actions: ['READ', 'UPDATE'],
          conditions: { canChangePrices: true, maxDiscountPercent: 10 }
        },
        {
          resource: 'PRODUCT',
          actions: ['READ']
        },
        {
          resource: 'CLIENT',
          actions: ['CREATE', 'READ', 'UPDATE']
        },
        {
          resource: 'REPORT',
          actions: ['READ']
        },
        {
          resource: 'DASHBOARD',
          actions: ['READ']
        },
        {
          resource: 'PACKAGING',
          actions: ['READ', 'UPDATE']
        }
      ]
    },
    
    'CASHIER': {
      name: 'CASHIER',
      displayName: 'Cashier',
      description: 'Processes immediate payments, cash sales, and financial reports',
      permissions: [
        {
          resource: 'CASH_SALE',
          actions: ['CREATE', 'READ', 'ISSUE']
        },
        {
          resource: 'INVOICE',
          actions: ['READ', 'UPDATE'],
          conditions: { canModifyLocked: true }
        },
        {
          resource: 'REPORT',
          actions: ['READ', 'EXPORT', 'CREATE']
        },
        {
          resource: 'DASHBOARD',
          actions: ['READ']
        },
        {
          resource: 'CLIENT',
          actions: ['READ']
        }
      ]
    },
    
    'DELIVERY': {
      name: 'DELIVERY',
      displayName: 'Delivery Personnel',
      description: 'Field delivery, proof of delivery',
      permissions: [
        {
          resource: 'ORDER',
          actions: ['READ', 'UPDATE']
        },
        {
          resource: 'PACKAGING',
          actions: ['READ']
        },
        {
          resource: 'DOCUMENT',
          actions: ['READ']
        }
      ]
    },
    
    'VIEWER': {
      name: 'VIEWER',
      displayName: 'Read-Only Access',
      description: 'View-only access for auditing',
      permissions: [
        { resource: 'ORDER', actions: ['READ'] },
        { resource: 'INVOICE', actions: ['READ'] },
        { resource: 'QUOTATION', actions: ['READ'] },
        { resource: 'CASH_SALE', actions: ['READ'] },
        { resource: 'PRODUCT', actions: ['READ'] },
        { resource: 'CLIENT', actions: ['READ'] },
        { resource: 'REPORT', actions: ['READ'] },
        { resource: 'DASHBOARD', actions: ['READ'] }
      ]
    }
  };
  
  const role = roleTemplates[roleName];
  if (!role) throw new Error(`Unknown role: ${roleName}`);
  
  const staff = new this({
    user: userId,
    employeeId,
    ...personalInfo,
    role,
    joinedAt: new Date()
  });
  
  await staff.logActivity('STAFF_CREATED', 'STAFF', {
    metadata: { role: roleName, createdBy: 'system' }
  });
  
  return staff.save();
};

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

StaffSchema.pre('save', function(next) {
  if (!this.schedule) {
    this.schedule = {
      monday: { start: '09:00', end: '17:00', isWorkingDay: true },
      tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
      wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
      thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
      friday: { start: '09:00', end: '17:00', isWorkingDay: true },
      saturday: { start: '09:00', end: '13:00', isWorkingDay: false },
      sunday: { start: '09:00', end: '13:00', isWorkingDay: false }
    };
  }
  
  const days: (keyof IWorkSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (const day of days) {
    if (!this.schedule[day]) {
      this.schedule[day] = {
        start: '09:00',
        end: '17:00',
        isWorkingDay: day !== 'saturday' && day !== 'sunday'
      };
    }
    
    if (!this.schedule[day].start) this.schedule[day].start = '09:00';
    if (!this.schedule[day].end) this.schedule[day].end = '17:00';
    if (this.schedule[day].isWorkingDay === undefined) {
      this.schedule[day].isWorkingDay = day !== 'saturday' && day !== 'sunday';
    }
  }
  
  
});

// ----------------------------------------------------------------------------
// MODEL EXPORT
// ----------------------------------------------------------------------------

export const Staff = mongoose.model<IStaff, IStaffModel>('Staff', StaffSchema);
export default Staff;