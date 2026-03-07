// ============================================================================
// TIME MANAGEMENT MODULE
// ============================================================================
// Core Purpose: Accountability tracking through automatic task-based timing
// Philosophy: No manual clock-in/out. Time derived from actual system actions.
// Interconnections:
//   - Auto-generated from Orders (processing time), Packaging (packing time)
//   - Auto-generated from Documents (issuance time), Messaging (response time)
//   - Feeds Dashboard (bottlenecks, efficiency trends)
//   - Feeds Staff metrics (performance analytics)
//   - Provides data for process improvement ("packing takes 45 min, not 20")
// ============================================================================

import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// ----------------------------------------------------------------------------
// TYPE DEFINITIONS
// ----------------------------------------------------------------------------

/**
 * Task types - mapped to actual business activities
 * Not generic "work", but specific accountable actions
 */
export type TaskType = 
  | 'ORDER_PROCESSING'      // Create → Confirm order
  | 'ORDER_CONFIRMATION'    // Specific approval step
  | 'PACKING'               // Start → Complete packaging
  | 'DELIVERY'              // Pickup → Delivery confirmation
  | 'PRICE_CHECK'           // Lookup/modify price
  | 'CLIENT_CALL'           // Phone call (logged via Messaging)
  | 'CLIENT_MESSAGE'        // WhatsApp/Email response
  | 'STOCK_CHECK'           // Inventory verification
  | 'DOCUMENT_ISSUANCE'     // Create → Issue invoice/quote
  | 'PAYMENT_PROCESSING'    // Record payment
  | 'DISPUTE_RESOLUTION'    // Handle complaint/issue
  | 'PRODUCT_RESEARCH'      // Sourcing new items
  | 'REPORT_GENERATION';    // Create management report

/**
 * Task outcome - what happened
 */
export type TaskOutcome = 
  | 'COMPLETED'      // Finished successfully
  | 'ESCAPED'        // Abandoned/timed out
  | 'TRANSFERRED'    // Handed to another staff
  | 'INTERRUPTED'    // Stopped but will resume
  | 'BATCHED';       // Combined with other tasks

/**
 * Location context
 */
export interface ILocation {
  type: 'OFFICE' | 'WAREHOUSE' | 'FIELD' | 'REMOTE' | 'MOBILE';
  name?: string;              // "Main Office", "Warehouse B"
  gps?: {
    lat: number;
    lng: number;
    accuracy: number;         // GPS accuracy in meters
    recordedAt: Date;
  };
  ipAddress?: string;
}

/**
 * Device context for audit
 */
export interface IDevice {
  deviceId: string;           // "TABLET-001", "DESKTOP-003"
  type: 'TABLET' | 'DESKTOP' | 'MOBILE' | 'KIOSK';
  browser?: string;
  os?: string;
  version?: string;
}

/**
 * Efficiency benchmarking
 */
export interface IEfficiencyMetrics {
  expectedDuration: number;   // Minutes (benchmark/standard)
  actualDuration: number;     // Minutes (calculated)
  variance: number;           // actual - expected (negative = faster)
  variancePercent: number;    // (variance / expected) * 100
  rating: 'EXCEEDS' | 'MEETS' | 'BELOW' | 'CRITICAL';
}

/**
 * Interruption tracking
 */
export interface IInterruption {
  startedAt: Date;
  reason: string;
  resumedAt?: Date;
  duration?: number;          // Minutes
  interruptedBy?: Types.ObjectId; // Staff who caused interruption
}

/**
 * Task batching (for efficiency)
 * Multiple small tasks done together
 */
export interface IBatchInfo {
  isBatched: boolean;
  batchId?: Types.ObjectId;   // Groups batched tasks
  taskCount?: number;         // How many tasks in batch
  batchIndex?: number;        // This task's position in batch
}

/**
 * Business context linking to other modules
 */
export interface ITaskContext {
  module: 'ORDER' | 'DOCUMENT' | 'PRODUCT' | 'CLIENT' | 'STOCK' | 'MESSAGE' | 'REPORT';
  entityId: Types.ObjectId;   // The specific order/document
  entityNumber: string;       // Human-readable (ORD-001, INV-123)
  entityStatus?: string;      // Status at completion
  clientId?: Types.ObjectId;  // For client-facing tasks
  clientName?: string;
}

/**
 * TimeRecord document
 * Immutable record of work performed
 */
export interface ITimeRecord extends Document {
  // --- Identity ---
  staff: Types.ObjectId;
  date: Date;                 // Work date (for grouping)
  
  // --- Task Definition ---
  taskType: TaskType;
  taskContext: ITaskContext;
  description: string;        // Auto-generated from context
  
  // --- Timing ---
  startedAt: Date;
  completedAt?: Date;
  duration: number;           // Minutes (0 if in-progress)
  isInProgress: boolean;      // Currently active?
  
  // --- Interruptions ---
  interruptions: IInterruption[];
  totalInterruptionTime: number; // Minutes
  
  // --- Context ---
  location: ILocation;
  device: IDevice;
  
  // --- Outcome ---
  outcome: TaskOutcome;
  transferredTo?: Types.ObjectId; // If handed off
  transferReason?: string;
  notes?: string;
  
  // --- Efficiency ---
  efficiency: IEfficiencyMetrics;
  batchInfo: IBatchInfo;
  
  // --- Audit ---
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;  // System or staff
  autoGenerated: boolean;     // true = from module action, false = manual
}

/**
 * Active task tracking (for "currently working on")
 * Lightweight collection for real-time status
 */
export interface IActiveTask extends Document {
  staff: Types.ObjectId;
  timeRecord: Types.ObjectId;
  startedAt: Date;
  taskType: TaskType;
  description: string;
  context: ITaskContext;
  lastActivityAt: Date;       // For timeout detection
  estimatedCompletion?: Date;
}

/**
 * Daily summary (aggregated for reporting)
 */
export interface IDailySummary extends Document {
  staff: Types.ObjectId;
  date: Date;
  totalTasks: number;
  completedTasks: number;
  totalWorkingMinutes: number;
  productiveMinutes: number;  // Minus interruptions
  tasksByType: Map<string, number>;
  averageEfficiency: number;  // Percentage
  varianceTotal: number;      // Sum of all variances
  bottlenecks: string[];      // Task types that took too long
}

// ----------------------------------------------------------------------------
// INTERFACE DEFINITIONS WITH STATICS
// ----------------------------------------------------------------------------

// Add this interface for the TimeRecord model statics
interface ITimeRecordModel extends Model<ITimeRecord> {
  startTask(
    staffId: Types.ObjectId,
    taskType: TaskType,
    context: {
      module: 'ORDER' | 'DOCUMENT' | 'PRODUCT' | 'CLIENT' | 'STOCK' | 'MESSAGE' | 'REPORT';
      entityId: Types.ObjectId;
      entityNumber: string;
      entityStatus?: string;
      clientId?: Types.ObjectId;
      clientName?: string;
    },
    description: string,
    deviceInfo: { deviceId: string; type: 'TABLET' | 'DESKTOP' | 'MOBILE' | 'KIOSK' },
    options?: {
      location?: ILocation;
      batchId?: Types.ObjectId;
      batchInfo?: { taskCount: number; batchIndex: number };
    }
  ): Promise<ITimeRecord>;
  
  completeTask(
    staffId: Types.ObjectId,
    entityId: Types.ObjectId,
    outcome?: TaskOutcome,
    notes?: string
  ): Promise<ITimeRecord | null>;
  
  getActiveTask(
    staffId: Types.ObjectId
  ): Promise<IActiveTask | null>;
  
  getBottlenecks(
    startDate: Date,
    endDate: Date,
    threshold?: number
  ): Promise<Array<{ taskType: TaskType; count: number; avgVariance: number }>>;
  
  getEfficiencyTrends(
    staffId?: Types.ObjectId,
    days?: number
  ): Promise<Array<{ date: Date; avgEfficiency: number; taskCount: number }>>;
}

// Also add interface for ActiveTask if needed
interface IActiveTaskModel extends Model<IActiveTask> {}

// Add interface for DailySummary if needed
interface IDailySummaryModel extends Model<IDailySummary> {}

// ----------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ----------------------------------------------------------------------------

const LocationSchema = new Schema<ILocation>({
  type: {
    type: String,
    enum: ['OFFICE', 'WAREHOUSE', 'FIELD', 'REMOTE', 'MOBILE'],
    default: 'OFFICE'
  },
  name: String,
  gps: {
    lat: Number,
    lng: Number,
    accuracy: Number,
    recordedAt: Date
  },
  ipAddress: String
}, { _id: false });

const DeviceSchema = new Schema<IDevice>({
  deviceId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['TABLET', 'DESKTOP', 'MOBILE', 'KIOSK'],
    required: true
  },
  browser: String,
  os: String,
  version: String
}, { _id: false });

const EfficiencyMetricsSchema = new Schema<IEfficiencyMetrics>({
  expectedDuration: {
    type: Number,
    required: true,
    min: 0
  },
  actualDuration: {
    type: Number,
    default: 0,
    min: 0
  },
  variance: {
    type: Number,
    default: 0
  },
  variancePercent: {
    type: Number,
    default: 0
  },
  rating: {
    type: String,
    enum: ['EXCEEDS', 'MEETS', 'BELOW', 'CRITICAL'],
    default: 'MEETS'
  }
}, { _id: false });

const InterruptionSchema = new Schema<IInterruption>({
  startedAt: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  resumedAt: Date,
  duration: Number,
  interruptedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, { _id: true });

const BatchInfoSchema = new Schema<IBatchInfo>({
  isBatched: {
    type: Boolean,
    default: false
  },
  batchId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  taskCount: Number,
  batchIndex: Number
}, { _id: false });

const TaskContextSchema = new Schema<ITaskContext>({
  module: {
    type: String,
    enum: ['ORDER', 'DOCUMENT', 'PRODUCT', 'CLIENT', 'STOCK', 'MESSAGE', 'REPORT'],
    required: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  entityNumber: {
    type: String,
    required: true
  },
  entityStatus: String,
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  clientName: String
}, { _id: false });

// ----------------------------------------------------------------------------
// TIME RECORD SCHEMA
// ----------------------------------------------------------------------------

const TimeRecordSchema = new Schema<ITimeRecord>({
  // --- Identity ---
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    index: true
  },
  
  date: {
    type: Date,
    required: true,
    index: true
  },

  // --- Task ---
  taskType: {
    type: String,
    enum: [
      'ORDER_PROCESSING', 'ORDER_CONFIRMATION', 'PACKING', 'DELIVERY',
      'PRICE_CHECK', 'CLIENT_CALL', 'CLIENT_MESSAGE', 'STOCK_CHECK',
      'DOCUMENT_ISSUANCE', 'PAYMENT_PROCESSING', 'DISPUTE_RESOLUTION',
      'PRODUCT_RESEARCH', 'REPORT_GENERATION'
    ],
    required: true,
    index: true
  },
  
  taskContext: {
    type: TaskContextSchema,
    required: true
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },

  // --- Timing ---
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  completedAt: Date,
  
  duration: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  
  isInProgress: {
    type: Boolean,
    default: true,
    index: true
  },

  // --- Interruptions ---
  interruptions: [InterruptionSchema],
  
  totalInterruptionTime: {
    type: Number,
    default: 0
  },

  // --- Context ---
  location: {
    type: LocationSchema,
    default: () => ({ type: 'OFFICE', device: { deviceId: 'UNKNOWN', type: 'DESKTOP' } })
  },
  
  device: {
    type: DeviceSchema,
    required: true
  },

  // --- Outcome ---
  outcome: {
    type: String,
    enum: ['COMPLETED', 'ESCAPED', 'TRANSFERRED', 'INTERRUPTED', 'BATCHED'],
    default: 'COMPLETED'
  },
  
  transferredTo: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  
  transferReason: String,
  notes: String,

  // --- Efficiency ---
  efficiency: {
    type: EfficiencyMetricsSchema,
    required: true,
    default: function() {
      return {
        expectedDuration: getBenchmark(this.taskType),
        actualDuration: 0,
        variance: 0,
        variancePercent: 0,
        rating: 'MEETS'
      };
    }
  },
  
  batchInfo: {
    type: BatchInfoSchema,
    default: () => ({ isBatched: false })
  },

  // --- Audit ---
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  
  autoGenerated: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ----------------------------------------------------------------------------
// ACTIVE TASK SCHEMA (Real-time tracking)
// ----------------------------------------------------------------------------

const ActiveTaskSchema = new Schema<IActiveTask>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    unique: true,              // One active task per staff
    index: true
  },
  
  timeRecord: {
    type: Schema.Types.ObjectId,
    ref: 'TimeRecord',
    required: true
  },
  
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  taskType: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  context: {
    type: TaskContextSchema,
    required: true
  },
  
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  
  estimatedCompletion: Date

}, { timestamps: true });

// ----------------------------------------------------------------------------
// DAILY SUMMARY SCHEMA
// ----------------------------------------------------------------------------

const DailySummarySchema = new Schema<IDailySummary>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    index: true
  },
  
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  totalTasks: {
    type: Number,
    default: 0
  },
  
  completedTasks: {
    type: Number,
    default: 0
  },
  
  totalWorkingMinutes: {
    type: Number,
    default: 0
  },
  
  productiveMinutes: {
    type: Number,
    default: 0
  },
  
  tasksByType: {
    type: Map,
    of: Number,
    default: () => new Map()
  },
  
  averageEfficiency: {
    type: Number,
    default: 100
  },
  
  varianceTotal: {
    type: Number,
    default: 0
  },
  
  bottlenecks: [String]

}, {
  timestamps: true
});

// Ensure one summary per staff per day
DailySummarySchema.index({ staff: 1, date: 1 }, { unique: true });

// ----------------------------------------------------------------------------
// BENCHMARK CONFIGURATION
// ----------------------------------------------------------------------------

/**
 * Expected durations for each task type (minutes)
 * These are starting benchmarks, refined by actual data over time
 */
const TASK_BENCHMARKS: Record<TaskType, number> = {
  'ORDER_PROCESSING': 15,      // Create and confirm order
  'ORDER_CONFIRMATION': 5,     // Just approval step
  'PACKING': 30,               // Per order (scales with item count)
  'DELIVERY': 60,              // Per delivery trip
  'PRICE_CHECK': 3,            // Quick lookup
  'CLIENT_CALL': 10,           // Average call
  'CLIENT_MESSAGE': 5,         // WhatsApp/email response
  'STOCK_CHECK': 5,            // Physical verification
  'DOCUMENT_ISSUANCE': 10,     // Create and issue invoice
  'PAYMENT_PROCESSING': 5,     // Record payment
  'DISPUTE_RESOLUTION': 30,    // Handle complaint
  'PRODUCT_RESEARCH': 45,      // Sourcing new item
  'REPORT_GENERATION': 20      // Create standard report
};

function getBenchmark(taskType: TaskType): number {
  return TASK_BENCHMARKS[taskType] || 15;
}

// ----------------------------------------------------------------------------
// VIRTUALS
// ----------------------------------------------------------------------------

/**
 * Productive duration (excluding interruptions)
 */
TimeRecordSchema.virtual('productiveDuration').get(function(this: ITimeRecord) {
  return this.duration - this.totalInterruptionTime;
});

/**
 * Is this record a bottleneck?
 */
TimeRecordSchema.virtual('isBottleneck').get(function(this: ITimeRecord) {
  return this.efficiency.variancePercent > 50; // Took 50% longer than expected
});

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

/**
 * Complete the task
 */
TimeRecordSchema.methods.complete = async function(
  outcome: TaskOutcome = 'COMPLETED',
  notes?: string
): Promise<void> {
  this.completedAt = new Date();
  this.isInProgress = false;
  this.outcome = outcome;
  this.notes = notes;
  
  // Calculate duration
  this.duration = Math.round(
    (this.completedAt.getTime() - this.startedAt.getTime()) / 60000
  );
  
  // Calculate efficiency
  this.efficiency.actualDuration = this.duration - this.totalInterruptionTime;
  this.efficiency.variance = this.efficiency.actualDuration - this.efficiency.expectedDuration;
  this.efficiency.variancePercent = Math.round(
    (this.efficiency.variance / this.efficiency.expectedDuration) * 100
  );
  
  // Rate performance
  if (this.efficiency.variancePercent <= -20) {
    this.efficiency.rating = 'EXCEEDS'; // 20% faster than expected
  } else if (this.efficiency.variancePercent <= 20) {
    this.efficiency.rating = 'MEETS';
  } else if (this.efficiency.variancePercent <= 50) {
    this.efficiency.rating = 'BELOW';
  } else {
    this.efficiency.rating = 'CRITICAL'; // Major bottleneck
  }
  
  // Remove from active tasks
  await mongoose.model<IActiveTask>('ActiveTask').deleteOne({ timeRecord: this._id });
  
  // Update daily summary
  await this.updateDailySummary();
  
  // Update staff metrics
  await this.updateStaffMetrics();
};

/**
 * Record interruption
 */
TimeRecordSchema.methods.addInterruption = function(
  reason: string,
  interruptedBy?: Types.ObjectId
): void {
  this.interruptions.push({
    startedAt: new Date(),
    reason,
    interruptedBy
  });
};

/**
 * Resume after interruption
 */
TimeRecordSchema.methods.resumeInterruption = function(): void {
  const lastInterruption = this.interruptions[this.interruptions.length - 1];
  if (lastInterruption && !lastInterruption.resumedAt) {
    lastInterruption.resumedAt = new Date();
    lastInterruption.duration = Math.round(
      (lastInterruption.resumedAt.getTime() - lastInterruption.startedAt.getTime()) / 60000
    );
    this.totalInterruptionTime += lastInterruption.duration;
  }
};

/**
 * Transfer task to another staff
 */
TimeRecordSchema.methods.transfer = async function(
  toStaffId: Types.ObjectId,
  reason: string
): Promise<void> {
  this.outcome = 'TRANSFERRED';
  this.transferredTo = toStaffId;
  this.transferReason = reason;
  this.completedAt = new Date();
  this.isInProgress = false;
  
  // Calculate partial duration
  this.duration = Math.round(
    (this.completedAt.getTime() - this.startedAt.getTime()) / 60000
  );
  
  await this.save();
  
  // Create new record for receiving staff
  await TimeRecord.create({
    staff: toStaffId,
    date: new Date(),
    taskType: this.taskType,
    taskContext: this.taskContext,
    description: `${this.description} [Transferred from ${this.staff}]`,
    startedAt: new Date(),
    efficiency: {
      expectedDuration: this.efficiency.expectedDuration - this.duration
    },
    device: this.device,
    location: this.location,
    createdBy: toStaffId,
    autoGenerated: true
  });
};

/**
 * Update daily summary aggregate
 */
TimeRecordSchema.methods.updateDailySummary = async function(): Promise<void> {
  const startOfDay = new Date(this.date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const DailySummary = mongoose.model<IDailySummary>('DailySummary');
  
  let summary = await DailySummary.findOne({
    staff: this.staff,
    date: startOfDay
  });
  
  if (!summary) {
    summary = new DailySummary({
      staff: this.staff,
      date: startOfDay
    });
  }
  
  summary.totalTasks += 1;
  if (this.outcome === 'COMPLETED') {
    summary.completedTasks += 1;
  }
  
  summary.totalWorkingMinutes += this.duration;
  summary.productiveMinutes += this.productiveDuration;
  summary.varianceTotal += this.efficiency.variance;
  
  // Count by type
  const currentCount = summary.tasksByType.get(this.taskType) || 0;
  summary.tasksByType.set(this.taskType, currentCount + 1);
  
  // Recalculate average efficiency
  const records = await mongoose.model<ITimeRecord>('TimeRecord').find({
    staff: this.staff,
    date: startOfDay,
    isInProgress: false
  });
  
  const avgEfficiency = records.reduce((sum, r) => {
    const expected = r.efficiency.expectedDuration || 1;
    const actual = r.efficiency.actualDuration || expected;
    return sum + (expected / actual) * 100;
  }, 0) / records.length;
  
  summary.averageEfficiency = Math.round(avgEfficiency);
  
  // Identify bottlenecks
  const bottlenecks = records
    .filter(r => r.efficiency.variancePercent > 50)
    .map(r => r.taskType);
  
  summary.bottlenecks = [...new Set(bottlenecks)];
  
  await summary.save();
};

/**
 * Update staff performance metrics
 */
TimeRecordSchema.methods.updateStaffMetrics = async function(): Promise<void> {
  const Staff = mongoose.model('Staff');
  const staff = await Staff.findById(this.staff);
  
  if (!staff) return;
  
  // Update specific metrics based on task type
  switch (this.taskType) {
    case 'ORDER_PROCESSING':
      staff.metrics.ordersProcessedThisMonth += 1;
      break;
    case 'PACKING':
      staff.metrics.itemsPackedThisMonth += this.taskContext.entityNumber ? 1 : 0;
      // Update average packing time
      const packingRecords = await mongoose.model<ITimeRecord>('TimeRecord').find({
        staff: this.staff,
        taskType: 'PACKING',
        isInProgress: false,
        'efficiency.actualDuration': { $gt: 0 }
      }).sort({ createdAt: -1 }).limit(10);
      
      if (packingRecords.length > 0) {
        const avgTime = packingRecords.reduce((sum, r) => sum + r.efficiency.actualDuration, 0) 
          / packingRecords.length;
        staff.metrics.averagePackingTimeMinutes = Math.round(avgTime);
      }
      break;
  }
  
  await staff.save();
};

// ----------------------------------------------------------------------------
// STATICS
// ----------------------------------------------------------------------------

/**
 * Start tracking a new task (called automatically by other modules)
 * This is the primary integration point
 */
/*TimeRecordSchema.statics.startTask = async function(
  staffId: Types.ObjectId,
  taskType: TaskType,
  context: {
    module: 'ORDER' | 'DOCUMENT' | 'PRODUCT' | 'CLIENT' | 'STOCK' | 'MESSAGE' | 'REPORT';
    entityId: Types.ObjectId;
    entityNumber: string;
    entityStatus?: string;
    clientId?: Types.ObjectId;
    clientName?: string;
  },
  description: string,
  deviceInfo: { deviceId: string; type: 'TABLET' | 'DESKTOP' | 'MOBILE' | 'KIOSK' },
  options?: {
    location?: ILocation;
    batchId?: Types.ObjectId;
    batchInfo?: { taskCount: number; batchIndex: number };
  }
): Promise<ITimeRecord> {
  // Check if staff has active task
  const ActiveTask = mongoose.model<IActiveTask>('ActiveTask');
  const existingActive = await ActiveTask.findOne({ staff: staffId });
  
  if (existingActive) {
    // Auto-complete previous task (or handle based on policy)
    const previousRecord = await this.findById(existingActive.timeRecord);
    if (previousRecord && previousRecord.isInProgress) {
      await previousRecord.complete('BATCHED', 'Auto-completed: started new task');
    }
  }
  
  // Create time record
  const record = new this({
    staff: staffId,
    date: new Date(),
    taskType,
    taskContext: context,
    description,
    startedAt: new Date(),
    isInProgress: true,
    efficiency: {
      expectedDuration: getBenchmark(taskType)
    },
    device: deviceInfo,
    location: options?.location || { type: 'OFFICE' },
    createdBy: staffId,
    autoGenerated: true,
    batchInfo: options?.batchId ? {
      isBatched: true,
      batchId: options.batchId,
      ...options.batchInfo
    } : { isBatched: false }
  });
  
  await record.save();
  
  // Create active task entry
  await ActiveTask.create({
    staff: staffId,
    timeRecord: record._id,
    taskType,
    description,
    context,
    estimatedCompletion: new Date(Date.now() + getBenchmark(taskType) * 60000)
  });
  
  return record;
};*/

// Define statics on the schema
TimeRecordSchema.statics.startTask = async function(
  staffId: Types.ObjectId,
  taskType: TaskType,
  context: {
    module: 'ORDER' | 'DOCUMENT' | 'PRODUCT' | 'CLIENT' | 'STOCK' | 'MESSAGE' | 'REPORT';
    entityId: Types.ObjectId;
    entityNumber: string;
    entityStatus?: string;
    clientId?: Types.ObjectId;
    clientName?: string;
  },
  description: string,
  deviceInfo: { deviceId: string; type: 'TABLET' | 'DESKTOP' | 'MOBILE' | 'KIOSK' },
  options?: {
    location?: ILocation;
    batchId?: Types.ObjectId;
    batchInfo?: { taskCount: number; batchIndex: number };
  }
): Promise<ITimeRecord> {
  // Check if staff has active task
  const ActiveTask = mongoose.model<IActiveTask>('ActiveTask');
  const existingActive = await ActiveTask.findOne({ staff: staffId });
  
  if (existingActive) {
    // Auto-complete previous task (or handle based on policy)
    const previousRecord = await this.findById(existingActive.timeRecord);
    if (previousRecord && previousRecord.isInProgress) {
      await previousRecord.complete('BATCHED', 'Auto-completed: started new task');
    }
  }
  
  // Create time record
  const record = new this({
    staff: staffId,
    date: new Date(),
    taskType,
    taskContext: context,
    description,
    startedAt: new Date(),
    isInProgress: true,
    efficiency: {
      expectedDuration: getBenchmark(taskType)
    },
    device: deviceInfo,
    location: options?.location || { type: 'OFFICE' },
    createdBy: staffId,
    autoGenerated: true,
    batchInfo: options?.batchId ? {
      isBatched: true,
      batchId: options.batchId,
      ...options.batchInfo
    } : { isBatched: false }
  });
  
  await record.save();
  
  // Create active task entry
  await ActiveTask.create({
    staff: staffId,
    timeRecord: record._id,
    taskType,
    description,
    context,
    estimatedCompletion: new Date(Date.now() + getBenchmark(taskType) * 60000)
  });
  
  return record;
};

TimeRecordSchema.statics.completeTask = async function(
  staffId: Types.ObjectId,
  entityId: Types.ObjectId,
  outcome?: TaskOutcome,
  notes?: string
): Promise<ITimeRecord | null> {
  const record = await this.findOne({
    staff: staffId,
    'taskContext.entityId': entityId,
    isInProgress: true
  }).sort({ startedAt: -1 });
  
  if (!record) return null;
  
  await record.complete(outcome || 'COMPLETED', notes);
  return record;
};

TimeRecordSchema.statics.getActiveTask = async function(
  staffId: Types.ObjectId
): Promise<IActiveTask | null> {
  return mongoose.model<IActiveTask>('ActiveTask').findOne({ staff: staffId });
};

TimeRecordSchema.statics.getBottlenecks = async function(
  startDate: Date,
  endDate: Date,
  threshold: number = 50
): Promise<Array<{ taskType: TaskType; count: number; avgVariance: number }>> {
  return this.aggregate([
    {
      $match: {
        startedAt: { $gte: startDate, $lte: endDate },
        isInProgress: false,
        'efficiency.variancePercent': { $gt: threshold }
      }
    },
    {
      $group: {
        _id: '$taskType',
        count: { $sum: 1 },
        avgVariance: { $avg: '$efficiency.variancePercent' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

TimeRecordSchema.statics.getEfficiencyTrends = async function(
  staffId?: Types.ObjectId,
  days: number = 30
): Promise<Array<{ date: Date; avgEfficiency: number; taskCount: number }>> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const match: any = {
    startedAt: { $gte: startDate },
    isInProgress: false
  };
  
  if (staffId) match.staff = staffId;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$startedAt' }
        },
        avgEfficiency: {
          $avg: {
            $multiply: [
              { $divide: ['$efficiency.expectedDuration', '$efficiency.actualDuration'] },
              100
            ]
          }
        },
        taskCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

/**
 * Complete a task by entity ID (convenience method)
 */
TimeRecordSchema.statics.completeTask = async function(
  staffId: Types.ObjectId,
  entityId: Types.ObjectId,
  outcome?: TaskOutcome,
  notes?: string
): Promise<ITimeRecord | null> {
  const record = await this.findOne({
    staff: staffId,
    'taskContext.entityId': entityId,
    isInProgress: true
  }).sort({ startedAt: -1 });
  
  if (!record) return null;
  
  await record.complete(outcome || 'COMPLETED', notes);
  return record;
};

/**
 * Get active task for staff
 */
TimeRecordSchema.statics.getActiveTask = async function(
  staffId: Types.ObjectId
): Promise<IActiveTask | null> {
  return mongoose.model<IActiveTask>('ActiveTask').findOne({ staff: staffId });
};

/**
 * Get bottleneck analysis
 */
TimeRecordSchema.statics.getBottlenecks = async function(
  startDate: Date,
  endDate: Date,
  threshold: number = 50
): Promise<Array<{ taskType: TaskType; count: number; avgVariance: number }>> {
  return this.aggregate([
    {
      $match: {
        startedAt: { $gte: startDate, $lte: endDate },
        isInProgress: false,
        'efficiency.variancePercent': { $gt: threshold }
      }
    },
    {
      $group: {
        _id: '$taskType',
        count: { $sum: 1 },
        avgVariance: { $avg: '$efficiency.variancePercent' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

/**
 * Get efficiency trends
 */
TimeRecordSchema.statics.getEfficiencyTrends = async function(
  staffId?: Types.ObjectId,
  days: number = 30
): Promise<Array<{ date: Date; avgEfficiency: number; taskCount: number }>> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const match: any = {
    startedAt: { $gte: startDate },
    isInProgress: false
  };
  
  if (staffId) match.staff = staffId;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$startedAt' }
        },
        avgEfficiency: {
          $avg: {
            $multiply: [
              { $divide: ['$efficiency.expectedDuration', '$efficiency.actualDuration'] },
              100
            ]
          }
        },
        taskCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// ----------------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------------

/**
 * Pre-save: Validate timing
 */
/*TimeRecordSchema.pre('save', function(next) {
  if (this.completedAt && this.startedAt > this.completedAt) {
    return next(new Error('CompletedAt cannot be before startedAt'));
  }
  next();
});*/

TimeRecordSchema.pre('save', async function () {
  if (this.completedAt && this.startedAt > this.completedAt) {
    throw new Error('CompletedAt cannot be before startedAt');
  }
});

// ----------------------------------------------------------------------------
// MODEL EXPORTS
// ----------------------------------------------------------------------------

//export const TimeRecord = mongoose.model<ITimeRecord>('TimeRecord', TimeRecordSchema);
//export const ActiveTask = mongoose.model<IActiveTask>('ActiveTask', ActiveTaskSchema);
//export const DailySummary = mongoose.model<IDailySummary>('DailySummary', DailySummarySchema);

//export default { TimeRecord, ActiveTask, DailySummary };

export const TimeRecord = mongoose.model<ITimeRecord, ITimeRecordModel>('TimeRecord', TimeRecordSchema);
export const ActiveTask = mongoose.model<IActiveTask, IActiveTaskModel>('ActiveTask', ActiveTaskSchema);
export const DailySummary = mongoose.model<IDailySummary, IDailySummaryModel>('DailySummary', DailySummarySchema);

export default { TimeRecord, ActiveTask, DailySummary };

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * AUTOMATIC TRACKING FROM ORDER MODULE:
 * 
 * // When Jacky starts creating an order
 * const timeRecord = await TimeRecord.startTask(
 *   jacky._id,
 *   'ORDER_PROCESSING',
 *   {
 *     module: 'ORDER',
 *     entityId: newOrder._id,
 *     entityNumber: newOrder.orderNumber,
 *     clientId: client._id,
 *     clientName: client.name
 *   },
 *   `Creating order for ${client.name}`,
 *   { deviceId: 'TABLET-001', type: 'TABLET' }
 * );
 * 
 * // When Jacky confirms the order
 * await TimeRecord.completeTask(jacky._id, newOrder._id, 'COMPLETED');
 * 
 * // Result: TimeRecord with duration, efficiency rating, etc.
 */

/**
 * AUTOMATIC TRACKING FROM PACKAGING:
 * 
 * // When packaging starts
 * await TimeRecord.startTask(
 *   jacky._id,
 *   'PACKING',
 *   {
 *     module: 'ORDER',
 *     entityId: order._id,
 *     entityNumber: order.orderNumber
 *   },
 *   `Packing order ${order.orderNumber} (${order.items.length} items)`,
 *   { deviceId: 'WAREHOUSE-TAB-01', type: 'TABLET' }
 * );
 * 
 * // When last item scanned
 * await TimeRecord.completeTask(jacky._id, order._id, 'COMPLETED');
 * 
 * // If takes longer than expected (30 min), flags as bottleneck
 * // Dashboard shows: "Packing taking 45 min avg, expected 30 min"
 */

/**
 * AUTOMATIC TRACKING FROM MESSAGING:
 * 
 * // When staff starts responding to client message
 * await TimeRecord.startTask(
 *   jacky._id,
 *   'CLIENT_MESSAGE',
 *   {
 *     module: 'MESSAGE',
 *     entityId: message._id,
 *     entityNumber: message.thread.toString(),
 *     clientId: client._id,
 *     clientName: client.name
 *   },
 *   `Responding to ${client.name} about ${message.context.relatedTo}`,
 *   { deviceId: 'DESKTOP-003', type: 'DESKTOP' }
 * );
 * 
 * // When message sent
 * await TimeRecord.completeTask(jacky._id, message._id);
 */

/**
 * BOTTLENECK DETECTION:
 * 
 * // Weekly review
 * const bottlenecks = await TimeRecord.getBottlenecks(
 *   new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
 *   new Date(),
 *   50 // Variance > 50%
 * );
 * 
 * // Result:
 * // [
 * //   { taskType: 'PACKING', count: 12, avgVariance: 65 },
 * //   { taskType: 'DELIVERY', count: 8, avgVariance: 82 }
 * // ]
 * // Action: Investigate why packing/delivery taking longer than expected
 */

/**
 * STAFF PERFORMANCE DASHBOARD:
 * 
 * // Get Jacky's efficiency trend
 * const trends = await TimeRecord.getEfficiencyTrends(jacky._id, 30);
 * 
 * // Get today's active task
 * const active = await TimeRecord.getActiveTask(jacky._id);
 * if (active) {
 *   console.log(`Jacky is currently: ${active.description}`);
 *   console.log(`Started: ${active.startedAt}`);
 *   console.log(`Expected done: ${active.estimatedCompletion}`);
 * }
 * 
 * // Get daily summary
 * const today = new Date();
 * today.setHours(0, 0, 0, 0);
 * const summary = await DailySummary.findOne({
 *   staff: jacky._id,
 *   date: today
 * });
 * 
 * console.log(`Tasks today: ${summary?.totalTasks}`);
 * console.log(`Productive time: ${summary?.productiveMinutes} min`);
 * console.log(`Bottlenecks: ${summary?.bottlenecks.join(', ')}`);
 */

/**
//  * INTERRUPTION HANDLING:
//  * 
//  * // Gilbert interrupts Jacky's packing to ask about stock
//  * const record = await TimeRecord.findOne({
//  *   staff: jacky._id,
//  *   taskType: 'PACKING',
//  *   isInProgress: true
//  * });
//  * 
//  * record.addInterruption('Stock inquiry from Gilbert', gilbert._id);
//  * await record.save();
//  * 
//  * // Jacky resumes packing
//  * record.resumeInterruption();
//  * await record.save();
//  * 
//  * // Final duration excludes interruption time
//  */

/**
 * TRANSFER HANDOFF:
 * 
 * // Jacky can't complete delivery, transfers to driver
 * const record = await TimeRecord.findOne({
 *   staff: jacky._id,
 *   taskType: 'DELIVERY',
 *   isInProgress: true
 * });
 * 
 * await record.transfer(driver._id, 'Vehicle breakdown, handing to backup driver');
 * 
 * // New record auto-created for driver
 * // Original record shows: TRANSFERRED with partial duration
 */

/**
 * BATCH PROCESSING:
 * 
 * // Gilbert processes 5 price checks at once
 * const batchId = new Types.ObjectId();
 * 
 * for (let i = 0; i < products.length; i++) {
 *   await TimeRecord.startTask(
 *     gilbert._id,
 *     'PRICE_CHECK',
 *     { module: 'PRODUCT', entityId: products[i]._id, entityNumber: products[i].sku },
 *     `Price check: ${products[i].name}`,
 *     { deviceId: 'DESKTOP-001', type: 'DESKTOP' },
 *     {
 *       batchId,
 *       batchInfo: { taskCount: products.length, batchIndex: i }
 *     }
 *   );
 * }
 * 
 * // Complete all at once
 * await TimeRecord.completeTask(gilbert._id, products[products.length - 1]._id);
 */