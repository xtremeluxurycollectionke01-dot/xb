// models/timemanagement.model.js
import mongoose from 'mongoose';

// Task Types enum
const TaskType = {
    ORDER_PROCESSING: 'ORDER_PROCESSING',
    ORDER_CONFIRMATION: 'ORDER_CONFIRMATION',
    PACKING: 'PACKING',
    DELIVERY: 'DELIVERY',
    PRICE_CHECK: 'PRICE_CHECK',
    CLIENT_CALL: 'CLIENT_CALL',
    CLIENT_MESSAGE: 'CLIENT_MESSAGE',
    STOCK_CHECK: 'STOCK_CHECK',
    DOCUMENT_ISSUANCE: 'DOCUMENT_ISSUANCE',
    PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
    DISPUTE_RESOLUTION: 'DISPUTE_RESOLUTION',
    PRODUCT_RESEARCH: 'PRODUCT_RESEARCH',
    REPORT_GENERATION: 'REPORT_GENERATION',
    QUALITY_CHECK: 'QUALITY_CHECK'
};

// Task Outcomes enum
const TaskOutcome = {
    COMPLETED: 'COMPLETED',
    ESCAPED: 'ESCAPED',
    TRANSFERRED: 'TRANSFERRED',
    INTERRUPTED: 'INTERRUPTED',
    BATCHED: 'BATCHED'
};

// Location Types enum
const LocationType = {
    OFFICE: 'OFFICE',
    WAREHOUSE: 'WAREHOUSE',
    FIELD: 'FIELD',
    REMOTE: 'REMOTE',
    MOBILE: 'MOBILE'
};

// Device Types enum
const DeviceType = {
    TABLET: 'TABLET',
    DESKTOP: 'DESKTOP',
    MOBILE: 'MOBILE',
    KIOSK: 'KIOSK'
};

// Module Types enum
const ModuleType = {
    ORDER: 'ORDER',
    DOCUMENT: 'DOCUMENT',
    PRODUCT: 'PRODUCT',
    CLIENT: 'CLIENT',
    STOCK: 'STOCK',
    MESSAGE: 'MESSAGE',
    REPORT: 'REPORT'
};

// Efficiency Ratings enum
const EfficiencyRating = {
    EXCEEDS: 'EXCEEDS',
    MEETS: 'MEETS',
    BELOW: 'BELOW',
    CRITICAL: 'CRITICAL'
};

// Task Benchmarks (minutes)
const TASK_BENCHMARKS = {
    [TaskType.ORDER_PROCESSING]: 15,
    [TaskType.ORDER_CONFIRMATION]: 5,
    [TaskType.PACKING]: 30,
    [TaskType.DELIVERY]: 60,
    [TaskType.PRICE_CHECK]: 3,
    [TaskType.CLIENT_CALL]: 10,
    [TaskType.CLIENT_MESSAGE]: 5,
    [TaskType.STOCK_CHECK]: 5,
    [TaskType.DOCUMENT_ISSUANCE]: 10,
    [TaskType.PAYMENT_PROCESSING]: 5,
    [TaskType.DISPUTE_RESOLUTION]: 30,
    [TaskType.PRODUCT_RESEARCH]: 45,
    [TaskType.REPORT_GENERATION]: 20
};

// GPS Location schema
const gpsLocationSchema = new mongoose.Schema({
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    recordedAt: { type: Date, default: Date.now }
}, { _id: false });

// Location schema
const locationSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: Object.values(LocationType),
        default: LocationType.OFFICE 
    },
    name: { type: String, default: null },
    gps: { type: gpsLocationSchema, default: null },
    ipAddress: { type: String, default: null }
}, { _id: false });

// Device schema
const deviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    type: { 
        type: String, 
        enum: Object.values(DeviceType),
        default: DeviceType.DESKTOP 
    },
    browser: { type: String, default: '' },
    os: { type: String, default: '' },
    version: { type: String, default: '1.0' }
}, { _id: false });

// Efficiency Metrics schema
const efficiencyMetricsSchema = new mongoose.Schema({
    expectedDuration: { type: Number, required: true, min: 0 },
    actualDuration: { type: Number, required: true, min: 0 },
    variance: { type: Number, required: true },
    variancePercent: { type: Number, required: true },
    rating: { 
        type: String, 
        enum: Object.values(EfficiencyRating),
        required: true 
    }
}, { _id: false });

// Interruption schema
const interruptionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    startedAt: { type: Date, required: true },
    reason: { type: String, required: true },
    resumedAt: { type: Date, default: null },
    duration: { type: Number, default: 0 },
    interruptedBy: { type: String, default: null }
}, { _id: false });

// Batch Info schema
const batchInfoSchema = new mongoose.Schema({
    isBatched: { type: Boolean, default: false },
    batchId: { type: String, default: null },
    taskCount: { type: Number, default: 0 },
    batchIndex: { type: Number, default: 0 }
}, { _id: false });

// Task Context schema
const taskContextSchema = new mongoose.Schema({
    module: { 
        type: String, 
        enum: Object.values(ModuleType),
        required: true 
    },
    entityId: { type: String, default: null },
    entityNumber: { type: String, default: '' },
    entityStatus: { type: String, default: null },
    clientId: { type: String, default: null },
    clientName: { type: String, default: null }
}, { _id: false });

// TIME RECORD SCHEMA
const timeRecordSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    
    // Identity
    staff: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    
    // Task Definition
    taskType: { 
        type: String, 
        enum: Object.values(TaskType),
        required: true 
    },
    taskContext: { type: taskContextSchema, required: true },
    description: { type: String, required: true },
    
    // Timing
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    duration: { type: Number, default: 0, min: 0 },
    isInProgress: { type: Boolean, default: true },
    
    // Interruptions
    interruptions: { type: [interruptionSchema], default: [] },
    totalInterruptionTime: { type: Number, default: 0, min: 0 },
    
    // Context
    location: { type: locationSchema, required: true },
    device: { type: deviceSchema, required: true },
    
    // Outcome
    outcome: { 
        type: String, 
        enum: Object.values(TaskOutcome),
        default: TaskOutcome.COMPLETED 
    },
    transferredTo: { type: String, default: null },
    transferReason: { type: String, default: null },
    notes: { type: String, default: null },
    
    // Efficiency
    efficiency: { type: efficiencyMetricsSchema, required: true },
    
    batchInfo: { type: batchInfoSchema, default: () => ({}) },
    
    // Audit
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, required: true },
    autoGenerated: { type: Boolean, default: true }
}, { 
    collection: 'time_records',
    _id: false,
    timestamps: true 
});

// Indexes for time records
timeRecordSchema.index({ staff: 1, date: -1 });
timeRecordSchema.index({ taskType: 1, date: -1 });
timeRecordSchema.index({ completedAt: 1 });
timeRecordSchema.index({ 'taskContext.clientId': 1 });

// Pre-save middleware
timeRecordSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for productive duration
timeRecordSchema.virtual('productiveDuration').get(function() {
    return this.duration - this.totalInterruptionTime;
});

// Virtual for bottleneck detection
timeRecordSchema.virtual('isBottleneck').get(function() {
    return this.efficiency.variancePercent > 50;
});

// ACTIVE TASK SCHEMA
const activeTaskSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    staff: { type: String, required: true, index: true, unique: true },
    timeRecord: { type: String, required: true },
    startedAt: { type: Date, required: true },
    taskType: { 
        type: String, 
        enum: Object.values(TaskType),
        required: true 
    },
    description: { type: String, required: true },
    context: { type: taskContextSchema, required: true },
    lastActivityAt: { type: Date, required: true },
    estimatedCompletion: { type: Date, required: true }
}, { 
    collection: 'active_tasks',
    _id: false,
    timestamps: true 
});

// DAILY SUMMARY SCHEMA
const dailySummarySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    staff: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    totalWorkingMinutes: { type: Number, default: 0 },
    productiveMinutes: { type: Number, default: 0 },
    tasksByType: { type: Map, of: Number, default: {} },
    averageEfficiency: { type: Number, default: 100 },
    varianceTotal: { type: Number, default: 0 },
    bottlenecks: { type: [String], default: [] }
}, { 
    collection: 'daily_summaries',
    _id: false,
    timestamps: true 
});

// Compound index for staff+date
dailySummarySchema.index({ staff: 1, date: -1 }, { unique: true });

// STAFF PERFORMANCE METRICS SCHEMA
const staffPerformanceSchema = new mongoose.Schema({
    staffId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    today: {
        tasksCompleted: { type: Number, default: 0 },
        productiveMinutes: { type: Number, default: 0 },
        efficiency: { type: Number, default: 100 },
        currentTask: {
            type: { type: String, enum: Object.values(TaskType) },
            description: { type: String },
            startedAt: { type: Date }
        }
    },
    week: {
        tasksCompleted: { type: Number, default: 0 },
        productiveHours: { type: Number, default: 0 },
        averageEfficiency: { type: Number, default: 100 }
    },
    month: {
        tasksCompleted: { type: Number, default: 0 },
        productiveHours: { type: Number, default: 0 },
        averageEfficiency: { type: Number, default: 100 }
    }
}, { 
    collection: 'staff_performance',
    timestamps: true 
});

// BOTTLENECK ANALYSIS SCHEMA
const bottleneckAnalysisSchema = new mongoose.Schema({
    taskType: { 
        type: String, 
        enum: Object.values(TaskType),
        required: true,
        unique: true 
    },
    count: { type: Number, default: 0 },
    avgVariance: { type: Number, default: 0 },
    affectedStaff: { type: [String], default: [] },
    trend: { type: String, enum: ['improving', 'stable', 'worsening'], default: 'stable' },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: 'bottleneck_analysis',
    timestamps: true 
});

// EFFICIENCY TRENDS SCHEMA
const efficiencyTrendsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    daily: [{
        date: { type: String, required: true },
        avgEfficiency: { type: Number, required: true },
        taskCount: { type: Number, required: true }
    }],
    byStaff: [{
        staff: { type: String, required: true },
        name: { type: String, required: true },
        trend: { type: [Number], required: true }
    }]
}, { 
    collection: 'efficiency_trends',
    timestamps: true 
});

// Create and export models
export const TimeRecord = mongoose.model('TimeRecord', timeRecordSchema);
export const ActiveTask = mongoose.model('ActiveTask', activeTaskSchema);
export const DailySummary = mongoose.model('DailySummary', dailySummarySchema);
export const StaffPerformance = mongoose.model('StaffPerformance', staffPerformanceSchema);
export const BottleneckAnalysis = mongoose.model('BottleneckAnalysis', bottleneckAnalysisSchema);
export const EfficiencyTrends = mongoose.model('EfficiencyTrends', efficiencyTrendsSchema);

// Export enums and benchmarks
export {
    TaskType,
    TaskOutcome,
    LocationType,
    DeviceType,
    ModuleType,
    EfficiencyRating,
    TASK_BENCHMARKS
};