// models/staff.model.js
import mongoose from 'mongoose';

// Resource Types enum
const ResourceType = {
    ORDER: 'ORDER',
    INVOICE: 'INVOICE',
    QUOTATION: 'QUOTATION',
    CASH_SALE: 'CASH_SALE',
    PRICE: 'PRICE',
    STOCK: 'STOCK',
    PRODUCT: 'PRODUCT',
    CLIENT: 'CLIENT',
    STAFF: 'STAFF',
    REPORT: 'REPORT',
    DASHBOARD: 'DASHBOARD',
    PACKAGING: 'PACKAGING',
    TIME: 'TIME',
    DOCUMENT: 'DOCUMENT',
    SUPPLIER: 'SUPPLIER'
};

// Action Types enum
const ActionType = {
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    APPROVE: 'APPROVE',
    ISSUE: 'ISSUE',
    VOID: 'VOID',
    EXPORT: 'EXPORT',
    ADMIN: 'ADMIN'
};

// Role Names enum (UPDATED)
const RoleName = {
    SYSTEM_ADMIN: 'SYSTEM_ADMIN',
    SALES_MANAGER: 'SALES_MANAGER',
    SALES_ASSOCIATE: 'SALES_ASSOCIATE',
    CASHIER: 'CASHIER',
    DELIVERY: 'DELIVERY',
    VIEWER: 'VIEWER'
};

// Activity Actions enum (UPDATED)
const ActivityAction = {
    // Order lifecycle
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_UPDATED: 'ORDER_UPDATED',
    ORDER_CONFIRMED: 'ORDER_CONFIRMED',
    ORDER_CANCELLED: 'ORDER_CANCELLED',
    ORDER_PACKED: 'ORDER_PACKED',
    ORDER_DELIVERED: 'ORDER_DELIVERED',
    
    // Document lifecycle
    INVOICE_ISSUED: 'INVOICE_ISSUED',
    INVOICE_PAID: 'INVOICE_PAID',
    INVOICE_VOIDED: 'INVOICE_VOIDED',
    QUOTATION_ISSUED: 'QUOTATION_ISSUED',
    QUOTATION_ACCEPTED: 'QUOTATION_ACCEPTED',
    QUOTATION_EXPIRED: 'QUOTATION_EXPIRED',
    CASH_SALE_ISSUED: 'CASH_SALE_ISSUED',
    
    // Product/Price actions
    PRICE_UPDATED: 'PRICE_UPDATED',
    PRODUCT_CREATED: 'PRODUCT_CREATED',
    STOCK_ADJUSTED: 'STOCK_ADJUSTED',
    
    // Client actions
    CLIENT_CREATED: 'CLIENT_CREATED',
    CLIENT_UPDATED: 'CLIENT_UPDATED',
    CLIENT_CONTACTED: 'CLIENT_CONTACTED',
    
    // Staff actions
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    PERMISSION_CHANGED: 'PERMISSION_CHANGED',
    PASSWORD_RESET: 'PASSWORD_RESET',
    STAFF_CREATED: 'STAFF_CREATED',
    
    // Packaging
    ITEM_SCANNED: 'ITEM_SCANNED',
    PACKAGE_COMPLETED: 'PACKAGE_COMPLETED',
    DISCREPANCY_NOTED: 'DISCREPANCY_NOTED',
    
    // System
    REPORT_GENERATED: 'REPORT_GENERATED',
    EXPORT_CREATED: 'EXPORT_CREATED',
    BACKUP_CREATED: 'BACKUP_CREATED'
};

// Permission Conditions schema
const permissionConditionsSchema = new mongoose.Schema({
    maxOrderValue: { type: Number, default: null },
    maxDiscountPercent: { type: Number, default: null },
    canChangePrices: { type: Boolean, default: false },
    canApproveOwn: { type: Boolean, default: false },
    canModifyLocked: { type: Boolean, default: false },
    requiresDualApproval: { type: Boolean, default: false },
    allowedCategories: { type: [String], default: [] },
    allowedClients: { type: [String], default: [] }
}, { _id: false });

// Permission schema
const permissionSchema = new mongoose.Schema({
    resource: { 
        type: String, 
        enum: Object.values(ResourceType),
        required: true 
    },
    actions: { 
        type: [String], 
        enum: Object.values(ActionType),
        default: [] 
    },
    conditions: { type: permissionConditionsSchema, default: () => ({}) }
}, { _id: false });

// Role schema (UPDATED with new role names)
const roleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        enum: Object.values(RoleName),
        required: true 
    },
    displayName: { type: String, required: true },
    permissions: { type: [permissionSchema], default: [] },
    description: { type: String, default: '' }
}, { _id: false });

// Schedule Day schema
const scheduleDaySchema = new mongoose.Schema({
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' },
    isWorkingDay: { type: Boolean, default: true },
    breakStart: { type: String, default: null },
    breakEnd: { type: String, default: null }
}, { _id: false });

// Work Schedule schema
const workScheduleSchema = new mongoose.Schema({
    monday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '17:00', isWorkingDay: true }) },
    tuesday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '17:00', isWorkingDay: true }) },
    wednesday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '17:00', isWorkingDay: true }) },
    thursday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '17:00', isWorkingDay: true }) },
    friday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '17:00', isWorkingDay: true }) },
    saturday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '13:00', isWorkingDay: false }) },
    sunday: { type: scheduleDaySchema, default: () => ({ start: '09:00', end: '13:00', isWorkingDay: false }) }
}, { _id: false });

// Activity Log Details schema
const activityDetailsSchema = new mongoose.Schema({
    previousValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

// Activity Log schema
const activityLogSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    action: { 
        type: String, 
        enum: Object.values(ActivityAction),
        required: true 
    },
    resource: { 
        type: String, 
        enum: Object.values(ResourceType),
        required: true 
    },
    targetId: { type: String, default: null },
    targetNumber: { type: String, default: '' },
    details: { type: activityDetailsSchema, default: () => ({}) },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    duration: { type: Number, default: null } // in seconds
}, { _id: false });

// Performance Metrics schema
const performanceMetricsSchema = new mongoose.Schema({
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
    averageStartTime: { type: String, default: null },
    averageEndTime: { type: String, default: null },
    activeHoursToday: { type: Number, default: 0 },
    clientComplaints: { type: Number, default: 0 },
    clientCompliments: { type: Number, default: 0 },
    lastCalculatedAt: { type: Date, default: Date.now }
}, { _id: false });

// MAIN STAFF SCHEMA
const staffSchema = new mongoose.Schema({
    // --- Identity ---
    _id: { type: String, required: true },
    user: { type: String, default: null },
    employeeId: { type: String, required: true, unique: true, index: true },
    
    // Personal info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    photo: { type: String, default: '' },
    
    // --- Role & Permissions ---
    role: { type: roleSchema, required: true },
    customPermissions: { type: [permissionSchema], default: [] },
    
    // --- Schedule ---
    schedule: { type: workScheduleSchema, default: () => ({}) },
    timezone: { type: String, default: 'Africa/Nairobi' },
    
    // --- Activity & Performance ---
    activity: { type: [activityLogSchema], default: [] },
    metrics: { type: performanceMetricsSchema, default: () => ({}) },
    
    // --- Status ---
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, required: true },
    leftAt: { type: Date, default: null },
    
    // --- Audit ---
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: null },
    passwordChangedAt: { type: Date, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'staff',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
staffSchema.index({ isActive: 1 });
staffSchema.index({ 'role.name': 1 });
staffSchema.index({ 'activity.timestamp': -1 });
staffSchema.index({ employeeId: 1 });
staffSchema.index({ email: 1 });

// Pre-save middleware to update timestamps
staffSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Staff Stats Aggregate schema
const staffStatsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    totalStaff: { type: Number, default: 0 },
    activeStaff: { type: Number, default: 0 },
    byRole: {
        [RoleName.SALES_ASSOCIATE]: { type: Number, default: 0 },
        [RoleName.SALES_MANAGER]: { type: Number, default: 0 },
        [RoleName.CASHIER]: { type: Number, default: 0 },
        [RoleName.SYSTEM_ADMIN]: { type: Number, default: 0 },
        [RoleName.DELIVERY]: { type: Number, default: 0 },
        [RoleName.VIEWER]: { type: Number, default: 0 }
    },
    activity: {
        totalToday: { type: Number, default: 0 },
        loginsToday: { type: Number, default: 0 },
        ordersCreated: { type: Number, default: 0 },
        ordersProcessed: { type: Number, default: 0 },
        documentsIssued: { type: Number, default: 0 }
    },
    performance: {
        topPerformer: { type: String, default: null },
        avgProductivityScore: { type: Number, default: 0 },
        totalRevenueThisMonth: { type: Number, default: 0 },
        totalOrdersThisMonth: { type: Number, default: 0 }
    },
    schedule: {
        onSchedule: { type: Number, default: 0 },
        offSchedule: { type: Number, default: 0 },
        lateStarters: { type: Number, default: 0 },
        earlyLeavers: { type: Number, default: 0 }
    }
}, { 
    collection: 'staff_stats',
    timestamps: true 
});

// Activity Feed schema (for real-time dashboard)
const activityFeedSchema = new mongoose.Schema({
    staffId: { type: String, required: true, ref: 'Staff' },
    staffName: { type: String, required: true },
    action: { 
        type: String, 
        enum: Object.values(ActivityAction),
        required: true 
    },
    target: { type: String, default: '' },
    timestamp: { type: Date, required: true },
    avatar: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { 
    collection: 'activity_feed',
    indexes: [
        { timestamp: -1 },
        { staffId: 1 }
    ]
});

// Permission Matrix schema (for caching)
const permissionMatrixSchema = new mongoose.Schema({
    role: { 
        type: String, 
        enum: Object.values(RoleName),
        required: true,
        unique: true 
    },
    matrix: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'permission_matrices',
    timestamps: true 
});

// Create and export models
export const Staff = mongoose.model('Staff', staffSchema);
export const StaffStats = mongoose.model('StaffStats', staffStatsSchema);
export const ActivityFeed = mongoose.model('ActivityFeed', activityFeedSchema);
export const PermissionMatrix = mongoose.model('PermissionMatrix', permissionMatrixSchema);

// Export enums for use in other files
export {
    ResourceType,
    ActionType,
    RoleName,
    ActivityAction
};