// models/packaging.model.js
import mongoose from 'mongoose';

// Packaging Priority enum
const PackagingPriority = {
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    URGENT: 'URGENT'
};

// Packaging Status enum
const PackagingStatus = {
    QUEUED: 'QUEUED',
    PREPARING: 'PREPARING',
    VERIFYING: 'VERIFYING',
    LABELING: 'LABELING',
    READY: 'READY',
    HANDED_OFF: 'HANDED_OFF',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    EXCEPTION: 'EXCEPTION'
};

// Stage Status enum
const StageStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    SKIPPED: 'SKIPPED'
};

// Handoff Methods enum
const HandoffMethod = {
    INTERNAL_DRIVER: 'INTERNAL_DRIVER',
    COURIER: 'COURIER',
    CLIENT_PICKUP: 'CLIENT_PICKUP',
    THIRD_PARTY: 'THIRD_PARTY'
};

// Exception Types enum
const ExceptionType = {
    STOCK_SHORTAGE: 'STOCK_SHORTAGE',
    ITEM_DAMAGED: 'ITEM_DAMAGED',
    WRONG_ITEM_DETECTED: 'WRONG_ITEM_DETECTED',
    CLIENT_CHANGE_REQUEST: 'CLIENT_CHANGE_REQUEST',
    PACKING_DELAY: 'PACKING_DELAY',
    EQUIPMENT_FAILURE: 'EQUIPMENT_FAILURE',
    STAFF_UNAVAILABLE: 'STAFF_UNAVAILABLE',
    DESTINATION_ISSUE: 'DESTINATION_ISSUE'
};

// Exception Severity enum
const ExceptionSeverity = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

// Resolution Actions enum
const ResolutionAction = {
    CORRECTED: 'CORRECTED',
    CLIENT_NOTIFIED: 'CLIENT_NOTIFIED',
    SUPERVISOR_APPROVED: 'SUPERVISOR_APPROVED',
    ORDER_SPLIT: 'ORDER_SPLIT',
    ORDER_CANCELLED: 'ORDER_CANCELLED',
    SOURCE_ALTERNATIVE: 'SOURCE_ALTERNATIVE'
};

// Verification Methods enum
const VerificationMethod = {
    BARCODE_SCAN: 'BARCODE_SCAN',
    MANUAL_CHECK: 'MANUAL_CHECK',
    SUPERVISOR_OVERRIDE: 'SUPERVISOR_OVERRIDE'
};

// Delivery Point Types enum
const DeliveryPointType = {
    OWN_SHOP: 'OWN_SHOP',
    CLIENT_OFFICE: 'CLIENT_OFFICE',
    WAREHOUSE: 'WAREHOUSE',
    RESIDENTIAL: 'RESIDENTIAL',
    CONSTRUCTION_SITE: 'CONSTRUCTION_SITE'
};

// Gathered Item schema
const gatheredItemSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    product: { type: String, default: null },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    quantityRequired: { type: Number, required: true, min: 0 },
    quantityGathered: { type: Number, required: true, min: 0 },
    location: { type: String, default: '' },
    gatheredBy: { type: String, required: true },
    gatheredAt: { type: Date, required: true },
    photo: { type: String, default: '' }
}, { _id: false });

// Mismatch schema
const mismatchSchema = new mongoose.Schema({
    detected: { type: Boolean, default: false },
    expectedSku: { type: String, default: '' },
    scannedSku: { type: String, default: '' },
    expectedName: { type: String, default: '' },
    scannedName: { type: String, default: '' },
    resolvedBy: { type: String, default: null },
    resolution: { type: String, enum: Object.values(ResolutionAction), default: null },
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date, default: null }
}, { _id: false });

// Verified Item schema
const verifiedItemSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    product: { type: String, default: null },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    quantityVerified: { type: Number, required: true, min: 0 },
    scanTimestamp: { type: Date, required: true },
    scanDevice: { type: String, default: '' },
    scannedBy: { type: String, required: true },
    mismatch: { type: mismatchSchema, default: () => ({}) }
}, { _id: false });

// Packaging Materials schema
const packagingMaterialsSchema = new mongoose.Schema({
    boxType: { type: String, default: '' },
    weight: { type: Number, default: 0 },
    dimensions: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 }
    },
    fragile: { type: Boolean, default: false },
    specialHandling: { type: String, default: '' },
    cushioning: { type: String, default: '' },
    cost: { type: Number, default: 0 }
}, { _id: false });

// Destination Label schema
const destinationLabelSchema = new mongoose.Schema({
    printed: { type: Boolean, default: false },
    printedAt: { type: Date, default: null },
    barcode: { type: String, default: '' },
    qrCodeData: { type: String, default: '' },
    destination: {
        name: { type: String, default: '' },
        address: { type: String, default: '' },
        contactPhone: { type: String, default: '' },
        contactName: { type: String, default: '' },
        deliveryInstructions: { type: String, default: '' }
    },
    scannedConfirmation: { type: Boolean, default: false },
    scannedAt: { type: Date, default: null },
    scannedBy: { type: String, default: null },
    labelPhoto: { type: String, default: '' }
}, { _id: false });

// Content Label schema
const contentLabelSchema = new mongoose.Schema({
    orderNumber: { type: String, default: '' },
    documentNumber: { type: String, default: '' },
    itemCount: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    fragileWarnings: { type: Number, default: 0 },
    specialInstructions: { type: [String], default: [] }
}, { _id: false });

// Labels container schema
const labelsSchema = new mongoose.Schema({
    destination: { type: destinationLabelSchema, default: () => ({}) },
    content: { type: contentLabelSchema, default: () => ({}) },
    return: { type: destinationLabelSchema, default: null }
}, { _id: false });

// Handoff Confirmation schema
const handoffConfirmationSchema = new mongoose.Schema({
    photo: { type: String, default: '' },
    signature: { type: String, default: '' },
    signatureName: { type: String, default: '' },
    pinCode: { type: String, default: '' },
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, default: '' },
    timestamp: { type: Date, required: true },
    gpsLocation: {
        lat: { type: Number },
        lng: { type: Number },
        accuracy: { type: Number, default: 0 }
    },
    notes: { type: String, default: '' }
}, { _id: false });

// Stage Tracking base schema
const stageTrackingSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(StageStatus),
        default: StageStatus.PENDING 
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    notes: { type: String, default: '' }
}, { _id: false });

// Preparation Stage schema
const preparationStageSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(StageStatus),
        default: StageStatus.PENDING 
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    notes: { type: String, default: '' },
    location: { type: String, default: '' },
    itemsGathered: { type: [gatheredItemSchema], default: [] },
    pickListPrinted: { type: Boolean, default: false },
    pickListPrintedAt: { type: Date, default: null }
}, { _id: false });

// Verification Stage schema
const verificationStageSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(StageStatus),
        default: StageStatus.PENDING 
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    notes: { type: String, default: '' },
    verifiedBy: { type: String, default: null },
    itemChecks: { type: [verifiedItemSchema], default: [] },
    allItemsVerified: { type: Boolean, default: false },
    verificationMethod: { 
        type: String, 
        enum: Object.values(VerificationMethod),
        default: VerificationMethod.BARCODE_SCAN 
    },
    overrideReason: { type: String, default: '' },
    packagingMaterials: { type: packagingMaterialsSchema, default: () => ({}) },
    packagePhoto: { type: String, default: '' }
}, { _id: false });

// Labeling Stage schema
const labelingStageSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(StageStatus),
        default: StageStatus.PENDING 
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    notes: { type: String, default: '' },
    labels: { type: labelsSchema, default: () => ({}) },
    labelVerificationPhoto: { type: String, default: '' }
}, { _id: false });

// Handoff Stage schema
const handoffStageSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(StageStatus),
        default: StageStatus.PENDING 
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    notes: { type: String, default: '' },
    handedTo: { type: String, default: null },
    handoffMethod: { 
        type: String, 
        enum: Object.values(HandoffMethod),
        default: HandoffMethod.INTERNAL_DRIVER 
    },
    courierName: { type: String, default: '' },
    courierTrackingNumber: { type: String, default: '' },
    vehicleInfo: { type: String, default: '' },
    confirmation: { type: handoffConfirmationSchema, default: () => ({}) },
    clientNotified: { type: Boolean, default: false },
    notificationSentAt: { type: Date, default: null }
}, { _id: false });

// Exception Resolution schema
const exceptionResolutionSchema = new mongoose.Schema({
    status: { type: String, default: 'OPEN' },
    resolvedBy: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
    action: { type: String, enum: Object.values(ResolutionAction), default: null },
    actionNotes: { type: String, default: '' },
    newTaskCreated: { type: String, default: null },
    clientNotified: { type: Boolean, default: false },
    notificationSentAt: { type: Date, default: null }
}, { _id: false });

// Exception schema
const packagingExceptionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    exceptionType: { 
        type: String, 
        enum: Object.values(ExceptionType),
        required: true 
    },
    detectedAt: { type: Date, required: true },
    detectedBy: { type: String, required: true },
    description: { type: String, required: true },
    severity: { 
        type: String, 
        enum: Object.values(ExceptionSeverity),
        required: true 
    },
    stage: { type: String, default: 'PREPARATION' },
    resolution: { type: exceptionResolutionSchema, default: () => ({}) },
    photos: { type: [String], default: [] },
    supervisorNotes: { type: String, default: '' }
}, { _id: false });

// Quality Metrics schema
const qualityMetricsSchema = new mongoose.Schema({
    packingTimeMinutes: { type: Number, default: 0 },
    preparationTimeMinutes: { type: Number, default: null },
    verificationTimeMinutes: { type: Number, default: null },
    labelingTimeMinutes: { type: Number, default: null },
    accuracyScore: { type: Number, default: 100, min: 0, max: 100 },
    mismatchesCount: { type: Number, default: 0 },
    damageReported: { type: Boolean, default: false },
    damageDetails: { type: String, default: '' },
    clientFeedback: { type: String, default: '' },
    clientRating: { type: Number, default: null, min: 1, max: 5 },
    redeliveryRequired: { type: Boolean, default: false },
    redeliveryReason: { type: String, default: '' }
}, { _id: false });

// Status History Entry schema
const statusHistoryEntrySchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: Object.values(PackagingStatus),
        required: true 
    },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, required: true },
    reason: { type: String, default: '' }
}, { _id: false });

// Delivery Tracking schema
const deliveryTrackingSchema = new mongoose.Schema({
    trackingNumber: { type: String, default: '' },
    courier: { type: String, default: '' },
    estimatedDelivery: { type: Date, default: null },
    actualDelivery: { type: Date, default: null },
    deliveryAttempts: { type: Number, default: 0 },
    currentLocation: { type: String, default: '' }
}, { _id: false });

// MAIN PACKAGING TASK SCHEMA
const packagingTaskSchema = new mongoose.Schema({
    // Identity
    _id: { type: String, required: true },
    taskId: { type: String, required: true, unique: true, index: true },
    order: { type: String, required: true, index: true },
    document: { type: String, default: null },
    
    // Assignment
    assignedTo: { type: String, default: null, index: true },
    supervisedBy: { type: String, default: null },
    
    // Scheduling
    priority: { 
        type: String, 
        enum: Object.values(PackagingPriority),
        required: true 
    },
    scheduledFor: { type: Date, required: true },
    deadline: { type: Date, required: true, index: true },
    
    // Stages
    stages: {
        preparation: { type: preparationStageSchema, default: () => ({}) },
        verification: { type: verificationStageSchema, default: () => ({}) },
        labeling: { type: labelingStageSchema, default: () => ({}) },
        handoff: { type: handoffStageSchema, default: () => ({}) }
    },
    
    // Exceptions
    exceptions: { type: [packagingExceptionSchema], default: [] },
    currentException: { type: String, default: null },
    
    // Quality
    quality: { type: qualityMetricsSchema, default: () => ({}) },
    
    // Status
    overallStatus: { 
        type: String, 
        enum: Object.values(PackagingStatus),
        required: true 
    },
    previousStatus: { type: String, enum: Object.values(PackagingStatus), default: null },
    statusHistory: { type: [statusHistoryEntrySchema], default: [] },
    
    // Delivery tracking
    deliveryTracking: { type: deliveryTrackingSchema, default: null },
    
    // Audit
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, default: null },
    createdBy: { type: String, required: true }
}, { 
    collection: 'packaging_tasks',
    _id: false,
    timestamps: true 
});

// Indexes for common queries
packagingTaskSchema.index({ overallStatus: 1, priority: 1 });
packagingTaskSchema.index({ assignedTo: 1, overallStatus: 1 });
packagingTaskSchema.index({ deadline: 1, overallStatus: 1 });
packagingTaskSchema.index({ 'stages.preparation.location': 1 });

// Pre-save middleware to update timestamps
packagingTaskSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtuals
packagingTaskSchema.virtual('isOverdue').get(function() {
    const deadline = new Date(this.deadline).getTime();
    const now = Date.now();
    return now > deadline && ![PackagingStatus.DELIVERED, PackagingStatus.EXCEPTION].includes(this.overallStatus);
});

packagingTaskSchema.virtual('minutesUntilDeadline').get(function() {
    return Math.ceil((new Date(this.deadline).getTime() - Date.now()) / 60000);
});

packagingTaskSchema.virtual('currentStage').get(function() {
    const stages = ['preparation', 'verification', 'labeling', 'handoff'];
    for (const stage of stages) {
        if (this.stages[stage].status !== StageStatus.COMPLETED) {
            return stage;
        }
    }
    return 'completed';
});

packagingTaskSchema.virtual('progressPercent').get(function() {
    const stageWeights = { preparation: 25, verification: 40, labeling: 20, handoff: 15 };
    let completed = 0;
    
    for (const [stage, weight] of Object.entries(stageWeights)) {
        if (this.stages[stage].status === StageStatus.COMPLETED) {
            completed += weight;
        }
    }
    
    return completed;
});

// DELIVERY POINT SCHEMA
const deliveryPointSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    client: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { 
        type: String, 
        enum: Object.values(DeliveryPointType),
        required: true 
    },
    
    address: {
        street: { type: String, required: true },
        building: { type: String, default: '' },
        floor: { type: String, default: '' },
        unit: { type: String, default: '' },
        city: { type: String, required: true },
        county: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: 'Kenya' },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    
    contact: {
        name: { type: String, default: '' },
        phone: { type: String, required: true },
        alternativePhone: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    
    access: {
        gateCode: { type: String, default: '' },
        securityCall: { type: Boolean, default: false },
        callBeforeArrival: { type: Boolean, default: false },
        parkingInstructions: { type: String, default: '' },
        deliveryHours: {
            monday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' } },
            tuesday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' } },
            wednesday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' } },
            thursday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' } },
            friday: { start: { type: String, default: '09:00' }, end: { type: String, default: '17:00' } },
            saturday: { start: { type: String, default: '09:00' }, end: { type: String, default: '13:00' } },
            sunday: { start: { type: String, default: '00:00' }, end: { type: String, default: '00:00' } }
        },
        restrictedAccess: { type: Boolean, default: false },
        accessNotes: { type: String, default: '' }
    },
    
    deliveryHistory: {
        successfulDeliveries: { type: Number, default: 0 },
        failedAttempts: { type: Number, default: 0 },
        averageDeliveryTimeMinutes: { type: Number, default: 0 },
        lastDeliveryDate: { type: Date, default: null },
        commonIssues: { type: [String], default: [] }
    },
    
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    requiresSpecialHandling: { type: Boolean, default: false },
    specialInstructions: { type: String, default: '' },
    
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'delivery_points',
    _id: false,
    timestamps: true 
});

// PACKING STATION SCHEMA
const equipmentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    deviceId: { type: String, required: true },
    serialNumber: { type: String, default: '' },
    lastCalibrated: { type: Date, default: null },
    isOperational: { type: Boolean, default: true },
    lastMaintenance: { type: Date, default: null }
}, { _id: false });

const packingStationSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    stationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    
    equipment: { type: [equipmentSchema], default: [] },
    assignedStaff: { type: [String], default: [] },
    currentTask: { type: String, default: null },
    queue: { type: [String], default: [] },
    capacity: { type: Number, default: 1 },
    
    tasksCompletedToday: { type: Number, default: 0 },
    averageTaskTimeMinutes: { type: Number, default: 0 },
    
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'packing_stations',
    _id: false,
    timestamps: true 
});

// Packaging Stats Schema
const packagingStatsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    totalTasks: { type: Number, default: 0 },
    byStatus: {
        [PackagingStatus.QUEUED]: { type: Number, default: 0 },
        [PackagingStatus.PREPARING]: { type: Number, default: 0 },
        [PackagingStatus.VERIFYING]: { type: Number, default: 0 },
        [PackagingStatus.READY]: { type: Number, default: 0 },
        [PackagingStatus.HANDED_OFF]: { type: Number, default: 0 },
        [PackagingStatus.EXCEPTION]: { type: Number, default: 0 }
    },
    byPriority: {
        [PackagingPriority.NORMAL]: { type: Number, default: 0 },
        [PackagingPriority.HIGH]: { type: Number, default: 0 },
        [PackagingPriority.URGENT]: { type: Number, default: 0 }
    },
    metrics: {
        averagePackingTime: { type: Number, default: 0 },
        accuracyRate: { type: Number, default: 0 },
        exceptionRate: { type: Number, default: 0 },
        onTimeDeliveryRate: { type: Number, default: 0 }
    },
    stationUtilization: {
        totalStations: { type: Number, default: 0 },
        activeStations: { type: Number, default: 0 },
        tasksInProgress: { type: Number, default: 0 },
        tasksQueued: { type: Number, default: 0 }
    },
    alerts: {
        overdueTasks: { type: Number, default: 0 },
        exceptionsOpen: { type: Number, default: 0 },
        urgentTasks: { type: Number, default: 0 }
    }
}, { 
    collection: 'packaging_stats',
    timestamps: true 
});

// Packaging Queue View Schema
const packagingQueueSchema = new mongoose.Schema({
    taskId: { type: String, required: true, ref: 'PackagingTask' },
    orderNumber: { type: String, required: true },
    clientName: { type: String, required: true },
    priority: { type: String, enum: Object.values(PackagingPriority), required: true },
    status: { type: String, enum: Object.values(PackagingStatus), required: true },
    deadline: { type: Date, required: true },
    assignedTo: { type: String, default: null },
    station: { type: String, default: null },
    items: { type: Number, default: 0 }
}, { 
    collection: 'packaging_queue',
    indexes: [
        { priority: 1, deadline: 1 },
        { status: 1, assignedTo: 1 }
    ]
});

// Exceptions Log Schema
const exceptionsLogSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    taskId: { type: String, required: true, ref: 'PackagingTask' },
    orderNumber: { type: String, required: true },
    type: { type: String, enum: Object.values(ExceptionType), required: true },
    severity: { type: String, enum: Object.values(ExceptionSeverity), required: true },
    description: { type: String, required: true },
    detectedAt: { type: Date, required: true },
    status: { type: String, default: 'OPEN' },
    resolvedBy: { type: String, default: null },
    resolution: { type: String, enum: Object.values(ResolutionAction), default: null }
}, { 
    collection: 'exceptions_log',
    indexes: [
        { detectedAt: -1 },
        { status: 1, severity: 1 }
    ]
});

// Create and export models
export const PackagingTask = mongoose.model('PackagingTask', packagingTaskSchema);
export const DeliveryPoint = mongoose.model('DeliveryPoint', deliveryPointSchema);
export const PackingStation = mongoose.model('PackingStation', packingStationSchema);
export const PackagingStats = mongoose.model('PackagingStats', packagingStatsSchema);
export const PackagingQueue = mongoose.model('PackagingQueue', packagingQueueSchema);
export const ExceptionsLog = mongoose.model('ExceptionsLog', exceptionsLogSchema);

// Export enums for use in other files
export {
    PackagingPriority,
    PackagingStatus,
    StageStatus,
    HandoffMethod,
    ExceptionType,
    ExceptionSeverity,
    ResolutionAction,
    VerificationMethod,
    DeliveryPointType
};