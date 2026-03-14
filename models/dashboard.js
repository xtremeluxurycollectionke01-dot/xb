// models/dashboard.model.js
import mongoose from 'mongoose';

// Widget Types enum
const WidgetType = {
    PROFIT_TODAY: 'PROFIT_TODAY',
    PROFIT_CHART: 'PROFIT_CHART',
    SALES_TODAY: 'SALES_TODAY',
    SALES_CHART: 'SALES_CHART',
    REVENUE_BY_CATEGORY: 'REVENUE_BY_CATEGORY',
    PENDING_ORDERS: 'PENDING_ORDERS',
    ORDERS_QUEUE: 'ORDERS_QUEUE',
    PACKING_STATUS: 'PACKING_STATUS',
    DELIVERY_STATUS: 'DELIVERY_STATUS',
    STOCK_ALERTS: 'STOCK_ALERTS',
    LOW_STOCK_ITEMS: 'LOW_STOCK_ITEMS',
    STAFF_ACTIVITY: 'STAFF_ACTIVITY',
    STAFF_PERFORMANCE: 'STAFF_PERFORMANCE',
    CLIENT_DEBT: 'CLIENT_DEBT',
    AGING_RECEIVABLES: 'AGING_RECEIVABLES',
    TOP_CLIENTS: 'TOP_CLIENTS',
    PENDING_APPROVALS: 'PENDING_APPROVALS',
    EXCEPTIONS_ALERT: 'EXCEPTIONS_ALERT',
    TIME_METRICS: 'TIME_METRICS',
    MESSAGES_UNREAD: 'MESSAGES_UNREAD',
    RECENT_ACTIVITY: 'RECENT_ACTIVITY',
    QUICK_ACTIONS: 'QUICK_ACTIONS',
    CASH_POSITION: 'CASH_POSITION',
    BANK_RECONCILIATION: 'BANK_RECONCILIATION',
    DAILY_TARGET: 'DAILY_TARGET',
    WEEKLY_COMPARISON: 'WEEKLY_COMPARISON',
    NOTIFICATIONS: 'NOTIFICATIONS'
};

// Alert Severity enum
const AlertSeverity = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL'
};

// Alert Type enum
const AlertType = {
    STOCK: 'STOCK',
    FINANCIAL: 'FINANCIAL',
    OPERATIONAL: 'OPERATIONAL',
    STAFF: 'STAFF',
    CLIENT: 'CLIENT'
};

// Date Range enum
const DateRange = {
    TODAY: 'TODAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH',
    QUARTER: 'QUARTER',
    YEAR: 'YEAR'
};

// Color Scheme enum
const ColorScheme = {
    DEFAULT: 'DEFAULT',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    DANGER: 'DANGER',
    INFO: 'INFO'
};

// Theme enum
const Theme = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
    AUTO: 'AUTO'
};

// Schema Definitions
const widgetPositionSchema = new mongoose.Schema({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    w: { type: Number, default: 3 },
    h: { type: Number, default: 2 }
}, { _id: false });

const widgetConfigSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: Object.values(WidgetType),
        default: WidgetType.PROFIT_TODAY 
    },
    position: { type: widgetPositionSchema, default: () => ({}) },
    title: { type: String, default: null },
    refreshInterval: { type: Number, default: 60 },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} },
    colorScheme: { 
        type: String, 
        enum: Object.values(ColorScheme),
        default: ColorScheme.DEFAULT 
    },
    showChart: { type: Boolean, default: true },
    drillDownEnabled: { type: Boolean, default: true }
}, { _id: false });

const alertThresholdsSchema = new mongoose.Schema({
    // Stock alerts
    lowStock: { type: Number, default: 10 },
    criticalStock: { type: Number, default: 5 },
    stockAlertCategories: { type: [String], default: [] },
    
    // Financial alerts
    overdueInvoice: { type: Number, default: 30 },
    highValueOrder: { type: Number, default: 100000 },
    negativeCash: { type: Boolean, default: true },
    creditLimitWarning: { type: Number, default: 80 },
    
    // Operational alerts
    packingDelay: { type: Number, default: 30 },
    deliveryOverdue: { type: Number, default: 4 },
    exceptionCount: { type: Number, default: 3 },
    
    // Staff alerts
    staffIdle: { type: Number, default: 30 },
    errorRate: { type: Number, default: 5 },
    
    // Client alerts
    clientComplaint: { type: Boolean, default: true },
    largeBalance: { type: Number, default: 500000 }
}, { _id: false });

const sharedAccessSchema = new mongoose.Schema({
    staffId: { type: String, default: null },
    widgets: { type: [String], default: [] },
    canConfigure: { type: Boolean, default: false },
    alertLevel: { type: String, default: 'RELEVANT' }
}, { _id: false });

// Main Dashboard Config Schema
const dashboardConfigSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    owner: { type: String, default: null },
    name: { type: String, default: 'Main Dashboard' },
    isDefault: { type: Boolean, default: false },
    widgets: { type: [widgetConfigSchema], default: [] },
    alerts: { type: alertThresholdsSchema, default: () => ({}) },
    sharedWith: { type: [sharedAccessSchema], default: [] },
    theme: { 
        type: String, 
        enum: Object.values(Theme),
        default: Theme.LIGHT 
    },
    refreshGlobal: { type: Number, default: 60 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'dashboard_configs',
    _id: false 
});

// Widget Data Schema (for caching widget data)
const hourlyTrendSchema = new mongoose.Schema({
    hour: Number,
    revenue: Number,
    profit: Number
}, { _id: false });

const profitTodaySchema = new mongoose.Schema({
    totalRevenue: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    grossProfit: { type: Number, default: 0 },
    grossMargin: { type: Number, default: 0 },
    targetProfit: { type: Number, default: 0 },
    vsYesterday: { type: Number, default: 0 },
    breakdown: {
        cashSales: { type: Number, default: 0 },
        invoicePayments: { type: Number, default: 0 },
        otherIncome: { type: Number, default: 0 },
        costOfGoods: { type: Number, default: 0 },
        operatingExpenses: { type: Number, default: 0 }
    },
    hourlyTrend: { type: [hourlyTrendSchema], default: [] }
}, { _id: false });

const salesDataSchema = new mongoose.Schema({
    today: {
        amount: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        vsYesterday: { type: Number, default: 0 },
        vsTarget: { type: Number, default: 0 }
    },
    thisWeek: {
        amount: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        vsLastWeek: { type: Number, default: 0 }
    },
    thisMonth: {
        amount: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        vsLastMonth: { type: Number, default: 0 }
    },
    byCategory: [{
        category: String,
        amount: Number,
        percentage: Number,
        growth: Number
    }],
    topProducts: [{
        sku: String,
        name: String,
        quantity: Number,
        revenue: Number
    }]
}, { _id: false });

const pendingOrdersSchema = new mongoose.Schema({
    totalPending: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    byStatus: [{
        status: String,
        count: Number,
        value: Number
    }],
    urgent: [{
        orderId: String,
        orderNumber: String,
        clientName: String,
        total: Number,
        deadline: Date,
        minutesRemaining: Number
    }],
    requiringApproval: [{
        orderId: String,
        orderNumber: String,
        clientName: String,
        total: Number,
        waitingSince: Date,
        waitingMinutes: Number
    }]
}, { _id: false });

const packingStatusSchema = new mongoose.Schema({
    activeTasks: { type: Number, default: 0 },
    queuedTasks: { type: Number, default: 0 },
    exceptionTasks: { type: Number, default: 0 },
    byStage: [{
        stage: String,
        count: Number,
        avgTime: Number
    }],
    todayCompleted: { type: Number, default: 0 },
    todayAccuracy: { type: Number, default: 100 },
    avgPackingTime: { type: Number, default: 0 },
    urgentTasks: [{
        taskId: String,
        orderNumber: String,
        priority: String,
        deadline: Date,
        currentStage: String,
        assignedTo: String
    }]
}, { _id: false });

const stockAlertSchema = new mongoose.Schema({
    lowStockCount: { type: Number, default: 0 },
    criticalStockCount: { type: Number, default: 0 },
    outOfStockCount: { type: Number, default: 0 },
    items: [{
        sku: String,
        name: String,
        category: String,
        currentStock: Number,
        reorderLevel: Number,
        suggestedOrder: Number,
        lastSold: Date,
        velocity: String
    }],
    byCategory: [{
        category: String,
        lowCount: Number
    }]
}, { _id: false });

const staffActivitySchema = new mongoose.Schema({
    totalStaff: { type: Number, default: 0 },
    activeNow: { type: Number, default: 0 },
    onBreak: { type: Number, default: 0 },
    idle: { type: Number, default: 0 },
    todayStats: [{
        staffId: String,
        name: String,
        role: String,
        tasksCompleted: Number,
        hoursActive: Number,
        efficiency: Number,
        currentTask: String
    }],
    performance: {
        topPerformer: String,
        needsAttention: [String],
        teamAverage: Number
    }
}, { _id: false });

const clientDebtSchema = new mongoose.Schema({
    totalReceivables: { type: Number, default: 0 },
    totalOverdue: { type: Number, default: 0 },
    overduePercentage: { type: Number, default: 0 },
    aging: [{
        bucket: String,
        amount: Number,
        count: Number,
        percentage: Number
    }],
    topDebtors: [{
        clientId: String,
        clientName: String,
        totalDue: Number,
        overdueAmount: Number,
        oldestInvoice: Date,
        daysOverdue: Number,
        riskLevel: String
    }],
    recentPayments: [{
        clientName: String,
        amount: Number,
        date: Date
    }]
}, { _id: false });

const timeMetricsSchema = new mongoose.Schema({
    avgOrderProcessing: { type: Number, default: 0 },
    avgPackingTime: { type: Number, default: 0 },
    avgDeliveryTime: { type: Number, default: 0 },
    today: {
        totalTasks: { type: Number, default: 0 },
        completedOnTime: { type: Number, default: 0 },
        delayed: { type: Number, default: 0 },
        exceptions: { type: Number, default: 0 }
    },
    trends: [{
        date: String,
        avgTime: Number,
        target: Number
    }],
    bottlenecks: [{
        stage: String,
        avgDelay: Number,
        frequency: Number
    }]
}, { _id: false });

// Main Widget Data schema (polymorphic)
const widgetDataSchema = new mongoose.Schema({
    widgetType: { 
        type: String, 
        enum: Object.values(WidgetType),
        required: true,
        index: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'widget_data',
    timestamps: true 
});

// Dashboard Alert Schema
const dashboardAlertSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    type: { 
        type: String, 
        enum: Object.values(AlertType),
        default: AlertType.OPERATIONAL 
    },
    severity: { 
        type: String, 
        enum: Object.values(AlertSeverity),
        default: AlertSeverity.INFO 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    sourceWidget: { type: String, default: null },
    relatedEntity: {
        type: { type: String },
        id: String,
        number: String
    },
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: { type: String, default: null },
    acknowledgedAt: { type: Date, default: null },
    autoResolved: { type: Boolean, default: false },
    resolvedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null }
}, { 
    collection: 'dashboard_alerts',
    _id: false 
});

// Recent Activity Schema
const recentActivitySchema = new mongoose.Schema({
    id: { type: String, required: true },
    action: { type: String, required: true },
    user: { type: String, required: true },
    time: { type: Date, required: true },
    type: { type: String, required: true },
    icon: { type: String, required: true },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { 
    collection: 'recent_activities',
    timestamps: true 
});

// Create and export models
export const DashboardConfig = mongoose.model('DashboardConfig', dashboardConfigSchema);
export const WidgetData = mongoose.model('WidgetData', widgetDataSchema);
export const DashboardAlert = mongoose.model('DashboardAlert', dashboardAlertSchema);
export const RecentActivity = mongoose.model('RecentActivity', recentActivitySchema);

// Export enums for use in other files
export {
    WidgetType,
    AlertSeverity,
    AlertType,
    DateRange,
    ColorScheme,
    Theme
};