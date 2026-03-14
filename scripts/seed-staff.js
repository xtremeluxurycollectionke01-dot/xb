// scripts/seed-staff.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Staff,
    StaffStats,
    ActivityFeed,
    PermissionMatrix,
    ResourceType,
    ActionType,
    RoleName,
    ActivityAction
} from '../models/staff.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Helper function to create permission objects
const createPermission = (resource, actions, conditions = {}) => ({
    resource,
    actions,
    conditions
});

// Role templates - mirrors backend exactly
const roleTemplates = {
    [RoleName.SYSTEM_ADMIN]: {
        name: RoleName.SYSTEM_ADMIN,
        displayName: 'System Administrator',
        description: 'Full system access with user management capabilities',
        permissions: [
            createPermission(ResourceType.ORDER, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE, ActionType.APPROVE, ActionType.VOID]),
            createPermission(ResourceType.INVOICE, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE, ActionType.ISSUE, ActionType.APPROVE, ActionType.VOID]),
            createPermission(ResourceType.QUOTATION, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE, ActionType.ISSUE]),
            createPermission(ResourceType.CASH_SALE, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE, ActionType.ISSUE, ActionType.VOID]),
            createPermission(ResourceType.PRICE, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE], { canChangePrices: true }),
            createPermission(ResourceType.STOCK, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE]),
            createPermission(ResourceType.PRODUCT, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE]),
            createPermission(ResourceType.CLIENT, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE]),
            createPermission(ResourceType.STAFF, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE, ActionType.ADMIN]),
            createPermission(ResourceType.REPORT, [ActionType.CREATE, ActionType.READ, ActionType.EXPORT]),
            createPermission(ResourceType.DASHBOARD, [ActionType.READ]),
            createPermission(ResourceType.PACKAGING, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE]),
            createPermission(ResourceType.DOCUMENT, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE]),
            createPermission(ResourceType.SUPPLIER, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.DELETE])
        ]
    },
    
    [RoleName.SALES_MANAGER]: {
        name: RoleName.SALES_MANAGER,
        displayName: 'Sales Manager',
        description: 'Approves large orders, manages inventory and suppliers, overrides price limits',
        permissions: [
            createPermission(ResourceType.ORDER, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.APPROVE], { maxOrderValue: 200000, canApproveOwn: false }),
            createPermission(ResourceType.INVOICE, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.ISSUE, ActionType.APPROVE, ActionType.VOID], { maxOrderValue: 200000 }),
            createPermission(ResourceType.QUOTATION, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.ISSUE]),
            createPermission(ResourceType.CASH_SALE, [ActionType.CREATE, ActionType.READ]),
            createPermission(ResourceType.PRICE, [ActionType.READ, ActionType.UPDATE], { canChangePrices: true }),
            createPermission(ResourceType.STOCK, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE]),
            createPermission(ResourceType.PRODUCT, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE]),
            createPermission(ResourceType.CLIENT, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE]),
            createPermission(ResourceType.REPORT, [ActionType.READ, ActionType.EXPORT]),
            createPermission(ResourceType.DASHBOARD, [ActionType.READ]),
            createPermission(ResourceType.SUPPLIER, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE])
        ]
    },
    
    [RoleName.SALES_ASSOCIATE]: {
        name: RoleName.SALES_ASSOCIATE,
        displayName: 'Sales Associate',
        description: 'Creates orders, issues invoices/quotations, manages client relationships',
        permissions: [
            createPermission(ResourceType.ORDER, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE], { maxOrderValue: 50000, canApproveOwn: false }),
            createPermission(ResourceType.INVOICE, [ActionType.CREATE, ActionType.READ, ActionType.ISSUE], { maxOrderValue: 50000 }),
            createPermission(ResourceType.QUOTATION, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE, ActionType.ISSUE]),
            createPermission(ResourceType.CASH_SALE, [ActionType.CREATE, ActionType.READ]),
            createPermission(ResourceType.PRICE, [ActionType.READ, ActionType.UPDATE], { canChangePrices: true, maxDiscountPercent: 10 }),
            createPermission(ResourceType.PRODUCT, [ActionType.READ]),
            createPermission(ResourceType.CLIENT, [ActionType.CREATE, ActionType.READ, ActionType.UPDATE]),
            createPermission(ResourceType.REPORT, [ActionType.READ]),
            createPermission(ResourceType.DASHBOARD, [ActionType.READ]),
            createPermission(ResourceType.PACKAGING, [ActionType.READ, ActionType.UPDATE])
        ]
    },
    
    [RoleName.CASHIER]: {
        name: RoleName.CASHIER,
        displayName: 'Cashier',
        description: 'Processes immediate payments, cash sales, and financial reports',
        permissions: [
            createPermission(ResourceType.CASH_SALE, [ActionType.CREATE, ActionType.READ, ActionType.ISSUE]),
            createPermission(ResourceType.INVOICE, [ActionType.READ, ActionType.UPDATE], { canModifyLocked: true }),
            createPermission(ResourceType.REPORT, [ActionType.READ, ActionType.EXPORT, ActionType.CREATE]),
            createPermission(ResourceType.DASHBOARD, [ActionType.READ]),
            createPermission(ResourceType.CLIENT, [ActionType.READ])
        ]
    },
    
    [RoleName.DELIVERY]: {
        name: RoleName.DELIVERY,
        displayName: 'Delivery Personnel',
        description: 'Field delivery, proof of delivery',
        permissions: [
            createPermission(ResourceType.ORDER, [ActionType.READ, ActionType.UPDATE]),
            createPermission(ResourceType.PACKAGING, [ActionType.READ]),
            createPermission(ResourceType.DOCUMENT, [ActionType.READ])
        ]
    },
    
    [RoleName.VIEWER]: {
        name: RoleName.VIEWER,
        displayName: 'Read-Only Access',
        description: 'View-only access for auditing',
        permissions: [
            createPermission(ResourceType.ORDER, [ActionType.READ]),
            createPermission(ResourceType.INVOICE, [ActionType.READ]),
            createPermission(ResourceType.QUOTATION, [ActionType.READ]),
            createPermission(ResourceType.CASH_SALE, [ActionType.READ]),
            createPermission(ResourceType.PRODUCT, [ActionType.READ]),
            createPermission(ResourceType.CLIENT, [ActionType.READ]),
            createPermission(ResourceType.REPORT, [ActionType.READ]),
            createPermission(ResourceType.DASHBOARD, [ActionType.READ])
        ]
    }
};

// Create staff data using templates
const createStaff = (id, employeeId, personalInfo, roleName, customData = {}) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const roleTemplate = roleTemplates[roleName];
    if (!roleTemplate) {
        throw new Error(`Unknown role: ${roleName}`);
    }

    // Base staff object
    const staff = {
        _id: id,
        user: `user_${id.replace('ST-', '')}`,
        employeeId,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        photo: personalInfo.photo || '',
        
        role: roleTemplate,
        customPermissions: [],
        
        schedule: {
            monday: { start: '09:00', end: '17:00', isWorkingDay: true },
            tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
            wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
            thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
            friday: { start: '09:00', end: '17:00', isWorkingDay: true },
            saturday: { start: '09:00', end: '13:00', isWorkingDay: false },
            sunday: { start: '09:00', end: '13:00', isWorkingDay: false }
        },
        timezone: 'Africa/Nairobi',
        
        activity: [],
        metrics: {
            ordersCreatedThisMonth: 0,
            ordersProcessedThisMonth: 0,
            averageOrderValue: 0,
            itemsPackedThisMonth: 0,
            averagePackingTimeMinutes: 0,
            documentsIssuedThisMonth: 0,
            documentsVoidedThisMonth: 0,
            errorRatePercent: 0,
            totalRevenueThisMonth: 0,
            totalCollectedThisMonth: 0,
            averageStartTime: null,
            averageEndTime: null,
            activeHoursToday: 0,
            clientComplaints: 0,
            clientCompliments: 0,
            lastCalculatedAt: now
        },
        
        isActive: true,
        joinedAt: new Date('2023-01-01T00:00:00Z'),
        leftAt: null,
        
        lastLoginAt: today,
        lastLoginIp: '192.168.1.100',
        passwordChangedAt: new Date('2023-12-01T00:00:00Z'),
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: now,
        
        ...customData
    };

    return staff;
};

// Activity templates for different roles
const getActivitiesForRole = (staffId, staffName, roleName) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const activities = [];

    // Common login/logout for all
    activities.push({
        _id: `act_${staffId}_001`,
        timestamp: today,
        action: ActivityAction.LOGIN,
        resource: ResourceType.STAFF,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0'
    });

    // Role-specific activities
    switch(roleName) {
        case RoleName.SALES_ASSOCIATE:
            activities.push(
                {
                    _id: `act_${staffId}_002`,
                    timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 15 * 60 * 1000),
                    action: ActivityAction.ORDER_CREATED,
                    resource: ResourceType.ORDER,
                    targetId: 'ord_005',
                    targetNumber: 'ORD-2024-000005',
                    details: {
                        newValue: { total: 1299.13, items: 2 }
                    }
                },
                {
                    _id: `act_${staffId}_003`,
                    timestamp: new Date(today.getTime() + 10 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    action: ActivityAction.PRICE_UPDATED,
                    resource: ResourceType.PRICE,
                    targetId: 'prod_001',
                    details: {
                        previousValue: 279.99,
                        newValue: 299.99,
                        metadata: { reason: 'Annual adjustment' }
                    }
                },
                {
                    _id: `act_${staffId}_004`,
                    timestamp: new Date(today.getTime() + 11 * 60 * 60 * 1000 + 45 * 60 * 1000),
                    action: ActivityAction.CLIENT_CONTACTED,
                    resource: ResourceType.CLIENT,
                    targetId: 'CL-001',
                    details: {
                        metadata: { type: 'call', duration: 15 }
                    }
                },
                {
                    _id: `act_${staffId}_005`,
                    timestamp: new Date(today.getTime() + 14 * 60 * 60 * 1000 + 20 * 60 * 1000),
                    action: ActivityAction.QUOTATION_ISSUED,
                    resource: ResourceType.QUOTATION,
                    targetId: 'doc_002',
                    targetNumber: 'QOT-2024-000567',
                    details: {
                        newValue: { total: 31772 }
                    }
                }
            );
            break;

        case RoleName.SALES_MANAGER:
            activities.push(
                {
                    _id: `act_${staffId}_002`,
                    timestamp: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    action: ActivityAction.ORDER_CONFIRMED,
                    resource: ResourceType.ORDER,
                    targetId: 'ord_001',
                    targetNumber: 'ORD-2024-000001',
                    details: {
                        previousValue: 'DRAFT',
                        newValue: 'CONFIRMED'
                    }
                },
                {
                    _id: `act_${staffId}_003`,
                    timestamp: new Date(yesterday.getTime() + 11 * 60 * 60 * 1000),
                    action: ActivityAction.STOCK_ADJUSTED,
                    resource: ResourceType.STOCK,
                    targetId: 'prod_008',
                    details: {
                        previousValue: 87,
                        newValue: 82,
                        metadata: { reason: 'Order reserved' }
                    }
                },
                {
                    _id: `act_${staffId}_004`,
                    timestamp: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    action: ActivityAction.INVOICE_ISSUED,
                    resource: ResourceType.INVOICE,
                    targetId: 'doc_001',
                    targetNumber: 'INV-2024-001234',
                    details: {
                        newValue: { total: 37040 }
                    }
                }
            );
            break;

        case RoleName.CASHIER:
            activities.push(
                {
                    _id: `act_${staffId}_002`,
                    timestamp: new Date(today.getTime() + 10 * 60 * 60 * 1000 + 15 * 60 * 1000),
                    action: ActivityAction.INVOICE_PAID,
                    resource: ResourceType.INVOICE,
                    targetId: 'doc_003',
                    targetNumber: 'INV-2024-000567',
                    details: {
                        previousValue: 521.97,
                        newValue: 0,
                        metadata: { method: 'CASH', amount: 521.97 }
                    }
                },
                {
                    _id: `act_${staffId}_003`,
                    timestamp: new Date(today.getTime() + 11 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    action: ActivityAction.CASH_SALE_ISSUED,
                    resource: ResourceType.CASH_SALE,
                    targetId: 'doc_003',
                    targetNumber: 'CS-2024-000123',
                    details: {
                        newValue: { total: 13920 }
                    }
                },
                {
                    _id: `act_${staffId}_004`,
                    timestamp: new Date(today.getTime() + 15 * 60 * 60 * 1000),
                    action: ActivityAction.REPORT_GENERATED,
                    resource: ResourceType.REPORT,
                    details: {
                        metadata: { reportType: 'daily_sales', format: 'PDF' }
                    }
                }
            );
            break;

        case RoleName.SYSTEM_ADMIN:
            activities.push(
                {
                    _id: `act_${staffId}_002`,
                    timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000),
                    action: ActivityAction.STAFF_CREATED,
                    resource: ResourceType.STAFF,
                    targetId: 'ST-007',
                    details: {
                        metadata: { newStaff: 'EMP-007', role: RoleName.SALES_ASSOCIATE }
                    }
                }
            );
            break;

        case RoleName.DELIVERY:
            activities.push(
                {
                    _id: `act_${staffId}_002`,
                    timestamp: new Date(today.getTime() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000),
                    action: ActivityAction.ITEM_SCANNED,
                    resource: ResourceType.PACKAGING,
                    targetId: 'ord_003',
                    details: {
                        metadata: { item: 'CANVAS-LG-24X36', quantity: 3 }
                    }
                },
                {
                    _id: `act_${staffId}_003`,
                    timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    action: ActivityAction.PACKAGE_COMPLETED,
                    resource: ResourceType.PACKAGING,
                    targetId: 'ord_003',
                    targetNumber: 'ORD-2024-000003'
                },
                {
                    _id: `act_${staffId}_004`,
                    timestamp: new Date(today.getTime() + 13 * 60 * 60 * 1000 + 15 * 60 * 1000),
                    action: ActivityAction.ORDER_DELIVERED,
                    resource: ResourceType.ORDER,
                    targetId: 'ord_003',
                    targetNumber: 'ORD-2024-000003',
                    details: {
                        previousValue: 'PACKED',
                        newValue: 'DELIVERED',
                        metadata: { proofOfDelivery: 'signature_ord_003.jpg' }
                    }
                }
            );
            break;

        case RoleName.VIEWER:
            activities.push(
                {
                    _id: `act_${staffId}_002`,
                    timestamp: new Date(today.getTime() + 10 * 60 * 60 * 1000),
                    action: ActivityAction.REPORT_GENERATED,
                    resource: ResourceType.REPORT,
                    details: {
                        metadata: { reportType: 'audit_log', format: 'PDF' }
                    }
                }
            );
            break;
    }

    // Logout for all
    activities.push({
        _id: `act_${staffId}_999`,
        timestamp: new Date(today.getTime() + 17 * 60 * 60 * 1000),
        action: ActivityAction.LOGOUT,
        resource: ResourceType.STAFF
    });

    return activities;
};

// Create all staff members
const staffMembers = [
    createStaff('ST-001', 'EMP-001', {
        firstName: 'Jacky',
        lastName: 'Chen',
        email: 'jacky.chen@lab.com',
        phone: '+254 722 111222',
        photo: ''
    }, RoleName.SALES_ASSOCIATE),
    
    createStaff('ST-002', 'EMP-002', {
        firstName: 'Gilbert',
        lastName: 'Mwangi',
        email: 'gilbert.mwangi@lab.com',
        phone: '+254 733 222333',
        photo: ''
    }, RoleName.SALES_MANAGER),
    
    createStaff('ST-003', 'EMP-003', {
        firstName: 'George',
        lastName: 'Odhiambo',
        email: 'george.odhiambo@lab.com',
        phone: '+254 744 333444',
        photo: ''
    }, RoleName.CASHIER),
    
    createStaff('ST-004', 'EMP-004', {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@lab.com',
        phone: '+254 755 444555',
        photo: ''
    }, RoleName.SYSTEM_ADMIN),
    
    createStaff('ST-005', 'EMP-005', {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@lab.com',
        phone: '+254 766 555666',
        photo: ''
    }, RoleName.DELIVERY),
    
    createStaff('ST-006', 'EMP-006', {
        firstName: 'View',
        lastName: 'Only',
        email: 'viewer@lab.com',
        phone: '+254 777 666777',
        photo: ''
    }, RoleName.VIEWER)
];

// Add activities to staff members
staffMembers.forEach(staff => {
    staff.activity = getActivitiesForRole(staff._id, staff.firstName, staff.role.name);
    
    // Calculate metrics based on activities
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthActivities = staff.activity.filter(a => new Date(a.timestamp) >= monthStart);
    
    staff.metrics.ordersCreatedThisMonth = monthActivities.filter(a => a.action === ActivityAction.ORDER_CREATED).length;
    staff.metrics.ordersProcessedThisMonth = monthActivities.filter(a => 
        [ActivityAction.ORDER_CONFIRMED, ActivityAction.ORDER_PACKED, ActivityAction.ORDER_DELIVERED].includes(a.action)
    ).length;
    staff.metrics.documentsIssuedThisMonth = monthActivities.filter(a => 
        [ActivityAction.INVOICE_ISSUED, ActivityAction.QUOTATION_ISSUED, ActivityAction.CASH_SALE_ISSUED].includes(a.action)
    ).length;
    
    // Calculate average start/end times from today's activities
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivities = staff.activity.filter(a => new Date(a.timestamp) >= today);
    
    if (todayActivities.length > 0) {
        const firstActivity = new Date(Math.min(...todayActivities.map(a => new Date(a.timestamp))));
        const lastActivity = new Date(Math.max(...todayActivities.map(a => new Date(a.timestamp))));
        
        staff.metrics.averageStartTime = `${String(firstActivity.getHours()).padStart(2, '0')}:${String(firstActivity.getMinutes()).padStart(2, '0')}`;
        staff.metrics.averageEndTime = `${String(lastActivity.getHours()).padStart(2, '0')}:${String(lastActivity.getMinutes()).padStart(2, '0')}`;
        staff.metrics.activeHoursToday = (lastActivity - firstActivity) / (1000 * 60 * 60);
    }
    
    staff.metrics.lastCalculatedAt = new Date();
});

// Staff stats
const staffStats = {
    date: new Date(),
    totalStaff: 6,
    activeStaff: 6,
    byRole: {
        [RoleName.SALES_ASSOCIATE]: 1,
        [RoleName.SALES_MANAGER]: 1,
        [RoleName.CASHIER]: 1,
        [RoleName.SYSTEM_ADMIN]: 1,
        [RoleName.DELIVERY]: 1,
        [RoleName.VIEWER]: 1
    },
    activity: {
        totalToday: staffMembers.reduce((sum, staff) => sum + staff.activity.filter(a => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return new Date(a.timestamp) >= today;
        }).length, 0),
        loginsToday: staffMembers.filter(s => s.lastLoginAt && new Date(s.lastLoginAt) >= new Date().setHours(0, 0, 0, 0)).length,
        ordersCreated: staffMembers.reduce((sum, staff) => sum + staff.metrics.ordersCreatedThisMonth, 0),
        ordersProcessed: staffMembers.reduce((sum, staff) => sum + staff.metrics.ordersProcessedThisMonth, 0),
        documentsIssued: staffMembers.reduce((sum, staff) => sum + staff.metrics.documentsIssuedThisMonth, 0)
    },
    performance: {
        topPerformer: 'ST-001',
        avgProductivityScore: 78,
        totalRevenueThisMonth: 82450.78,
        totalOrdersThisMonth: 8
    },
    schedule: {
        onSchedule: 4,
        offSchedule: 2,
        lateStarters: 1,
        earlyLeavers: 0
    }
};

// Activity feed items
const activityFeed = [
    {
        staffId: 'ST-001',
        staffName: 'Jacky Chen',
        action: ActivityAction.ORDER_CREATED,
        target: 'ORD-2024-000005',
        timestamp: new Date(),
        avatar: 'JC',
        metadata: { orderTotal: 1299.13 }
    },
    {
        staffId: 'ST-003',
        staffName: 'George Odhiambo',
        action: ActivityAction.INVOICE_PAID,
        target: 'INV-2024-000567',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        avatar: 'GO',
        metadata: { amount: 521.97, method: 'CASH' }
    },
    {
        staffId: 'ST-005',
        staffName: 'Sarah Johnson',
        action: ActivityAction.ORDER_DELIVERED,
        target: 'ORD-2024-000003',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        avatar: 'SJ',
        metadata: { proofOfDelivery: 'signature_ord_003.jpg' }
    },
    {
        staffId: 'ST-002',
        staffName: 'Gilbert Mwangi',
        action: ActivityAction.INVOICE_ISSUED,
        target: 'INV-2024-001234',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        avatar: 'GM',
        metadata: { total: 37040 }
    },
    {
        staffId: 'ST-001',
        staffName: 'Jacky Chen',
        action: ActivityAction.PRICE_UPDATED,
        target: 'Classic Leather Album',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        avatar: 'JC',
        metadata: { oldPrice: 279.99, newPrice: 299.99 }
    }
];

// Permission matrices for each role
const permissionMatrices = Object.entries(roleTemplates).map(([roleName, role]) => {
    const matrix = {};
    role.permissions.forEach(perm => {
        matrix[perm.resource] = perm.actions;
    });
    return {
        role: roleName,
        matrix,
        updatedAt: new Date()
    };
});

async function seedStaff() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Staff.deleteMany({}),
            StaffStats.deleteMany({}),
            ActivityFeed.deleteMany({}),
            PermissionMatrix.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Staff
        console.log('👥 Seeding staff members...');
        await Staff.insertMany(staffMembers);
        console.log(`✅ ${staffMembers.length} staff members seeded`);

        // Seed Staff Stats
        console.log('📊 Seeding staff statistics...');
        await StaffStats.create(staffStats);
        console.log('✅ Staff statistics seeded');

        // Seed Activity Feed
        console.log('📋 Seeding activity feed...');
        await ActivityFeed.insertMany(activityFeed);
        console.log(`✅ ${activityFeed.length} activity feed items seeded`);

        // Seed Permission Matrices
        console.log('🔐 Seeding permission matrices...');
        await PermissionMatrix.insertMany(permissionMatrices);
        console.log(`✅ ${permissionMatrices.length} permission matrices seeded`);

        // Verify counts
        const counts = await Promise.all([
            Staff.countDocuments(),
            StaffStats.countDocuments(),
            ActivityFeed.countDocuments(),
            PermissionMatrix.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Staff Members: ${counts[0]}`);
        console.log(`   Staff Stats: ${counts[1]}`);
        console.log(`   Activity Feed: ${counts[2]}`);
        console.log(`   Permission Matrices: ${counts[3]}`);

        // Role breakdown
        const roleBreakdown = await Staff.aggregate([
            {
                $group: {
                    _id: "$role.name",
                    count: { $sum: 1 },
                    avgProductivity: { $avg: "$metrics.productivityScore" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (roleBreakdown.length > 0) {
            console.log('\n📈 Role Breakdown:');
            roleBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} staff member(s)`);
            });
        }

        // Recent activity summary
        const recentActivity = await ActivityFeed.find().sort({ timestamp: -1 }).limit(5);
        if (recentActivity.length > 0) {
            console.log('\n🕒 Recent Activity:');
            recentActivity.forEach(act => {
                const timeAgo = Math.round((Date.now() - new Date(act.timestamp)) / (60 * 1000));
                console.log(`   ${act.staffName}: ${act.action} - ${timeAgo} minutes ago`);
            });
        }

        console.log('\n✅ Staff seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding staff:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedStaff();