// scripts/seed-dashboard.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    DashboardConfig,
    WidgetData,
    DashboardAlert,
    RecentActivity,
    WidgetType,
    AlertSeverity,
    AlertType,
    ColorScheme,
    Theme
} from '../models/dashboard.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Dummy data (from your existing code)
const dummyData = {
    // Dashboard configuration
    config: {
        _id: 'dash_main_001',
        owner: 'ST-001',
        name: 'Executive Dashboard',
        isDefault: true,
        
        widgets: [
            {
                type: WidgetType.PROFIT_TODAY,
                position: { x: 0, y: 0, w: 3, h: 2 },
                title: "Today's Profit",
                refreshInterval: 60,
                filters: {},
                colorScheme: ColorScheme.SUCCESS,
                showChart: true,
                drillDownEnabled: true
            },
            {
                type: WidgetType.SALES_TODAY,
                position: { x: 3, y: 0, w: 3, h: 2 },
                title: 'Sales Overview',
                refreshInterval: 60,
                filters: { dateRange: 'TODAY' },
                colorScheme: ColorScheme.INFO,
                showChart: true,
                drillDownEnabled: true
            },
            {
                type: WidgetType.PENDING_ORDERS,
                position: { x: 6, y: 0, w: 3, h: 2 },
                title: 'Pending Orders',
                refreshInterval: 30,
                filters: {},
                colorScheme: ColorScheme.WARNING,
                showChart: false,
                drillDownEnabled: true
            },
            {
                type: WidgetType.PACKING_STATUS,
                position: { x: 9, y: 0, w: 3, h: 2 },
                title: 'Packing Status',
                refreshInterval: 30,
                filters: {},
                colorScheme: ColorScheme.DEFAULT,
                showChart: true,
                drillDownEnabled: true
            },
            {
                type: WidgetType.STOCK_ALERTS,
                position: { x: 0, y: 2, w: 4, h: 3 },
                title: 'Stock Alerts',
                refreshInterval: 300,
                filters: {},
                colorScheme: ColorScheme.DANGER,
                showChart: false,
                drillDownEnabled: true
            },
            {
                type: WidgetType.STAFF_ACTIVITY,
                position: { x: 4, y: 2, w: 4, h: 3 },
                title: 'Staff Activity',
                refreshInterval: 60,
                filters: {},
                colorScheme: ColorScheme.INFO,
                showChart: true,
                drillDownEnabled: true
            },
            {
                type: WidgetType.CLIENT_DEBT,
                position: { x: 8, y: 2, w: 4, h: 3 },
                title: 'Client Debt',
                refreshInterval: 300,
                filters: {},
                colorScheme: ColorScheme.WARNING,
                showChart: true,
                drillDownEnabled: true
            }
        ],
        
        alerts: {
            lowStock: 10,
            criticalStock: 5,
            stockAlertCategories: ['paper', 'boxes', 'protective'],
            overdueInvoice: 30,
            highValueOrder: 100000,
            negativeCash: true,
            creditLimitWarning: 80,
            packingDelay: 30,
            deliveryOverdue: 4,
            exceptionCount: 3,
            staffIdle: 30,
            errorRate: 5,
            clientComplaint: true,
            largeBalance: 500000
        },
        
        sharedWith: [
            {
                staffId: 'ST-002',
                widgets: [WidgetType.SALES_TODAY, WidgetType.PENDING_ORDERS, WidgetType.CLIENT_DEBT],
                canConfigure: false,
                alertLevel: 'RELEVANT'
            },
            {
                staffId: 'ST-003',
                widgets: [WidgetType.STOCK_ALERTS, WidgetType.PACKING_STATUS, WidgetType.STAFF_ACTIVITY],
                canConfigure: false,
                alertLevel: 'RELEVANT'
            }
        ],
        
        theme: Theme.LIGHT,
        refreshGlobal: 60,
        
        createdAt: new Date('2025-02-18T00:00:00.000Z'),
        updatedAt: new Date('2025-02-18T00:00:00.000Z')
    },
    
    // Widget data cache
    widgetData: {
        [WidgetType.PROFIT_TODAY]: {
            totalRevenue: 245000,
            totalCost: 147000,
            grossProfit: 98000,
            grossMargin: 40,
            targetProfit: 120000,
            vsYesterday: -12.5,
            
            breakdown: {
                cashSales: 95000,
                invoicePayments: 150000,
                otherIncome: 0,
                costOfGoods: 137000,
                operatingExpenses: 10000
            },
            
            hourlyTrend: [
                { hour: 8, revenue: 15000, profit: 6000 },
                { hour: 9, revenue: 25000, profit: 10000 },
                { hour: 10, revenue: 35000, profit: 14000 },
                { hour: 11, revenue: 42000, profit: 16800 },
                { hour: 12, revenue: 38000, profit: 15200 },
                { hour: 13, revenue: 22000, profit: 8800 },
                { hour: 14, revenue: 28000, profit: 11200 },
                { hour: 15, revenue: 30000, profit: 12000 },
                { hour: 16, revenue: 25000, profit: 10000 },
                { hour: 17, revenue: 15000, profit: 6000 }
            ]
        },
        
        [WidgetType.SALES_TODAY]: {
            today: {
                amount: 245000,
                count: 18,
                vsYesterday: 8.5,
                vsTarget: 92
            },
            thisWeek: {
                amount: 1250000,
                count: 94,
                vsLastWeek: 12.3
            },
            thisMonth: {
                amount: 4200000,
                count: 312,
                vsLastMonth: -2.1
            },
            
            byCategory: [
                { category: 'Wedding Albums', amount: 98000, percentage: 40, growth: 15 },
                { category: 'Photo Books', amount: 73500, percentage: 30, growth: 8 },
                { category: 'Canvas Prints', amount: 49000, percentage: 20, growth: -5 },
                { category: 'Frames', amount: 24500, percentage: 10, growth: 12 }
            ],
            
            topProducts: [
                { sku: 'ALB-001', name: 'Classic Leather Album', quantity: 12, revenue: 35880 },
                { sku: 'BOOK-004', name: 'Standard Photo Book', quantity: 25, revenue: 30625 },
                { sku: 'CAN-007', name: 'Small Canvas', quantity: 30, revenue: 17550 },
                { sku: 'FRM-011', name: 'Basic Frame', quantity: 40, revenue: 13960 }
            ]
        },
        
        [WidgetType.PENDING_ORDERS]: {
            totalPending: 24,
            totalValue: 485000,
            
            byStatus: [
                { status: 'DRAFT', count: 5, value: 85000 },
                { status: 'CONFIRMED', count: 8, value: 165000 },
                { status: 'PACKING', count: 6, value: 142000 },
                { status: 'PACKED', count: 5, value: 93000 }
            ],
            
            urgent: [
                {
                    orderId: 'ORD-001',
                    orderNumber: 'ORD-001',
                    clientName: 'Johnson Family',
                    total: 45000,
                    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
                    minutesRemaining: 120
                },
                {
                    orderId: 'ORD-004',
                    orderNumber: 'ORD-004',
                    clientName: 'Wilson Family',
                    total: 52000,
                    deadline: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
                    minutesRemaining: 210
                }
            ],
            
            requiringApproval: [
                {
                    orderId: 'ORD-005',
                    orderNumber: 'ORD-005',
                    clientName: 'Brown & Co',
                    total: 89000,
                    waitingSince: new Date(Date.now() - 45 * 60 * 1000),
                    waitingMinutes: 45
                }
            ]
        },
        
        [WidgetType.PACKING_STATUS]: {
            activeTasks: 8,
            queuedTasks: 12,
            exceptionTasks: 2,
            
            byStage: [
                { stage: 'Preparation', count: 3, avgTime: 15 },
                { stage: 'Verification', count: 2, avgTime: 8 },
                { stage: 'Labeling', count: 2, avgTime: 5 },
                { stage: 'Ready', count: 1, avgTime: 0 }
            ],
            
            todayCompleted: 24,
            todayAccuracy: 98,
            avgPackingTime: 32,
            
            urgentTasks: [
                {
                    taskId: 'TASK-001',
                    orderNumber: 'ORD-001',
                    priority: 'URGENT',
                    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
                    currentStage: 'Verification',
                    assignedTo: 'James Wilson'
                },
                {
                    taskId: 'TASK-004',
                    orderNumber: 'ORD-004',
                    priority: 'HIGH',
                    deadline: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
                    currentStage: 'Preparation',
                    assignedTo: 'Sarah Johnson'
                }
            ]
        },
        
        [WidgetType.STOCK_ALERTS]: {
            lowStockCount: 5,
            criticalStockCount: 3,
            outOfStockCount: 1,
            
            items: [
                {
                    sku: 'PKG-005',
                    name: 'Cardboard Boxes - Large',
                    category: 'boxes',
                    currentStock: 8,
                    reorderLevel: 15,
                    suggestedOrder: 25,
                    lastSold: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    velocity: 'HIGH'
                },
                {
                    sku: 'PKG-006',
                    name: 'Bubble Wrap',
                    category: 'protective',
                    currentStock: 3,
                    reorderLevel: 5,
                    suggestedOrder: 10,
                    lastSold: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    velocity: 'MEDIUM'
                },
                {
                    sku: 'MAT-001',
                    name: 'Matte Paper 8x10',
                    category: 'paper',
                    currentStock: 12,
                    reorderLevel: 20,
                    suggestedOrder: 50,
                    lastSold: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    velocity: 'HIGH'
                }
            ],
            
            byCategory: [
                { category: 'boxes', lowCount: 2 },
                { category: 'protective', lowCount: 1 },
                { category: 'paper', lowCount: 1 }
            ]
        },
        
        [WidgetType.STAFF_ACTIVITY]: {
            totalStaff: 12,
            activeNow: 8,
            onBreak: 2,
            idle: 2,
            
            todayStats: [
                {
                    staffId: 'ST-001',
                    name: 'Alex Chen',
                    role: 'Lead Photographer',
                    tasksCompleted: 12,
                    hoursActive: 6.5,
                    efficiency: 95,
                    currentTask: 'Client consultation'
                },
                {
                    staffId: 'ST-002',
                    name: 'Maria Garcia',
                    role: 'Lab Technician',
                    tasksCompleted: 15,
                    hoursActive: 7.2,
                    efficiency: 88,
                    currentTask: 'Color correction'
                },
                {
                    staffId: 'ST-003',
                    name: 'James Wilson',
                    role: 'Quality Control',
                    tasksCompleted: 8,
                    hoursActive: 5.5,
                    efficiency: 92,
                    currentTask: 'Reviewing ORD-001'
                },
                {
                    staffId: 'ST-004',
                    name: 'Sarah Johnson',
                    role: 'Packaging Specialist',
                    tasksCompleted: 18,
                    hoursActive: 6.8,
                    efficiency: 96,
                    currentTask: 'Packing ORD-004'
                },
                {
                    staffId: 'ST-005',
                    name: 'Michael Brown',
                    role: 'Lab Manager',
                    tasksCompleted: 6,
                    hoursActive: 4.2,
                    efficiency: 90,
                    currentTask: null
                }
            ],
            
            performance: {
                topPerformer: 'Sarah Johnson',
                needsAttention: ['Maria Garcia'],
                teamAverage: 92
            }
        },
        
        [WidgetType.CLIENT_DEBT]: {
            totalReceivables: 1250000,
            totalOverdue: 380000,
            overduePercentage: 30.4,
            
            aging: [
                { bucket: 'Current', amount: 870000, count: 28, percentage: 69.6 },
                { bucket: '1-30 Days', amount: 210000, count: 9, percentage: 16.8 },
                { bucket: '31-60 Days', amount: 95000, count: 4, percentage: 7.6 },
                { bucket: '61-90 Days', amount: 55000, count: 2, percentage: 4.4 },
                { bucket: '90+ Days', amount: 20000, count: 1, percentage: 1.6 }
            ],
            
            topDebtors: [
                {
                    clientId: 'CL-005',
                    clientName: 'Brown & Co',
                    totalDue: 245000,
                    overdueAmount: 89000,
                    oldestInvoice: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
                    daysOverdue: 35,
                    riskLevel: 'MEDIUM'
                },
                {
                    clientId: 'CL-003',
                    clientName: 'Davis Portrait',
                    totalDue: 185000,
                    overdueAmount: 42000,
                    oldestInvoice: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
                    daysOverdue: 42,
                    riskLevel: 'MEDIUM'
                },
                {
                    clientId: 'CL-001',
                    clientName: 'Johnson Family',
                    totalDue: 98000,
                    overdueAmount: 15000,
                    oldestInvoice: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                    daysOverdue: 28,
                    riskLevel: 'LOW'
                }
            ],
            
            recentPayments: [
                {
                    clientName: 'Smith Wedding',
                    amount: 85000,
                    date: new Date(Date.now() - 2 * 60 * 60 * 1000)
                },
                {
                    clientName: 'Wilson Family',
                    amount: 52000,
                    date: new Date(Date.now() - 5 * 60 * 60 * 1000)
                }
            ]
        },
        
        [WidgetType.TIME_METRICS]: {
            avgOrderProcessing: 18,
            avgPackingTime: 32,
            avgDeliveryTime: 28,
            
            today: {
                totalTasks: 42,
                completedOnTime: 35,
                delayed: 7,
                exceptions: 2
            },
            
            trends: [
                { date: '2025-02-12', avgTime: 34, target: 30 },
                { date: '2025-02-13', avgTime: 32, target: 30 },
                { date: '2025-02-14', avgTime: 35, target: 30 },
                { date: '2025-02-15', avgTime: 31, target: 30 },
                { date: '2025-02-16', avgTime: 29, target: 30 },
                { date: '2025-02-17', avgTime: 30, target: 30 },
                { date: '2025-02-18', avgTime: 32, target: 30 }
            ],
            
            bottlenecks: [
                { stage: 'Packing', avgDelay: 15, frequency: 8 },
                { stage: 'Quality Check', avgDelay: 12, frequency: 5 }
            ]
        }
    },
    
    // Active alerts
    alerts: [
        {
            _id: 'alert_001',
            type: AlertType.STOCK,
            severity: AlertSeverity.CRITICAL,
            title: 'Critical Stock Levels',
            message: 'Large boxes and bubble wrap are below critical levels',
            sourceWidget: WidgetType.STOCK_ALERTS,
            relatedEntity: {
                type: 'PRODUCT',
                id: 'PKG-005',
                number: 'PKG-005'
            },
            acknowledged: false,
            acknowledgedBy: null,
            acknowledgedAt: null,
            autoResolved: false,
            resolvedAt: null,
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
            _id: 'alert_002',
            type: AlertType.OPERATIONAL,
            severity: AlertSeverity.WARNING,
            title: 'Packing Exception',
            message: '2 orders have packing exceptions requiring attention',
            sourceWidget: WidgetType.PACKING_STATUS,
            relatedEntity: {
                type: 'ORDER',
                id: 'ORD-002',
                number: 'ORD-002'
            },
            acknowledged: true,
            acknowledgedBy: 'ST-003',
            acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000),
            autoResolved: false,
            resolvedAt: null,
            createdAt: new Date(Date.now() - 25 * 60 * 1000),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
            _id: 'alert_003',
            type: AlertType.FINANCIAL,
            severity: AlertSeverity.WARNING,
            title: 'High Overdue Receivables',
            message: 'KSh 380,000 in overdue payments across 16 invoices',
            sourceWidget: WidgetType.CLIENT_DEBT,
            relatedEntity: null,
            acknowledged: false,
            acknowledgedBy: null,
            acknowledgedAt: null,
            autoResolved: false,
            resolvedAt: null,
            createdAt: new Date(Date.now() - 45 * 60 * 1000),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    ],
    
    // Recent activity feed
    recentActivity: [
        {
            id: 'act_001',
            action: 'Order ORD-001 completed',
            user: 'Alex Chen',
            time: new Date(Date.now() - 5 * 60 * 1000),
            type: 'success',
            icon: 'fa-check-circle',
            metadata: {
                orderId: 'ORD-001',
                amount: 45000
            }
        },
        {
            id: 'act_002',
            action: 'New client registered',
            user: 'Maria Garcia',
            time: new Date(Date.now() - 15 * 60 * 1000),
            type: 'info',
            icon: 'fa-user-plus',
            metadata: {
                clientId: 'CL-006',
                clientName: 'Taylor Photography'
            }
        },
        {
            id: 'act_003',
            action: 'Quality check failed for ORD-002',
            user: 'James Wilson',
            time: new Date(Date.now() - 30 * 60 * 1000),
            type: 'warning',
            icon: 'fa-exclamation-triangle',
            metadata: {
                orderId: 'ORD-002',
                reason: 'Color mismatch'
            }
        },
        {
            id: 'act_004',
            action: 'Payment received from Smith Wedding',
            user: 'System',
            time: new Date(Date.now() - 60 * 60 * 1000),
            type: 'success',
            icon: 'fa-credit-card',
            metadata: {
                amount: 85000,
                clientId: 'CL-002'
            }
        },
        {
            id: 'act_005',
            action: 'Staff break started',
            user: 'Sarah Johnson',
            time: new Date(Date.now() - 120 * 60 * 1000),
            type: 'info',
            icon: 'fa-coffee',
            metadata: {
                staffId: 'ST-004',
                duration: '15 min'
            }
        }
    ]
};

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            DashboardConfig.deleteMany({}),
            WidgetData.deleteMany({}),
            DashboardAlert.deleteMany({}),
            RecentActivity.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Dashboard Config
        console.log('📊 Seeding dashboard config...');
        await DashboardConfig.create(dummyData.config);
        console.log('✅ Dashboard config seeded');

        // Seed Widget Data
        console.log('📈 Seeding widget data...');
        const widgetDataPromises = Object.entries(dummyData.widgetData).map(([widgetType, data]) => {
            return WidgetData.create({
                widgetType,
                data,
                updatedAt: new Date()
            });
        });
        await Promise.all(widgetDataPromises);
        console.log(`✅ ${Object.keys(dummyData.widgetData).length} widget data records seeded`);

        // Seed Alerts
        console.log('⚠️ Seeding alerts...');
        await DashboardAlert.insertMany(dummyData.alerts);
        console.log(`✅ ${dummyData.alerts.length} alerts seeded`);

        // Seed Recent Activity
        console.log('📝 Seeding recent activity...');
        await RecentActivity.insertMany(dummyData.recentActivity);
        console.log(`✅ ${dummyData.recentActivity.length} recent activities seeded`);

        // Verify counts
        const counts = await Promise.all([
            DashboardConfig.countDocuments(),
            WidgetData.countDocuments(),
            DashboardAlert.countDocuments(),
            RecentActivity.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Dashboard Configs: ${counts[0]}`);
        console.log(`   Widget Data Records: ${counts[1]}`);
        console.log(`   Alerts: ${counts[2]}`);
        console.log(`   Recent Activities: ${counts[3]}`);

        console.log('\n✅ Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedDatabase();