// scripts/seed-packaging.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    PackagingTask,
    DeliveryPoint,
    PackingStation,
    PackagingStats,
    PackagingQueue,
    ExceptionsLog,
    PackagingPriority,
    PackagingStatus,
    StageStatus,
    HandoffMethod,
    ExceptionType,
    ExceptionSeverity,
    ResolutionAction,
    VerificationMethod,
    DeliveryPointType
} from '../models/packaging.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Helper function to create gathered items
const createGatheredItem = (id, data) => ({
    _id: `gather_${id}`,
    product: data.product,
    sku: data.sku,
    name: data.name,
    quantityRequired: data.quantityRequired,
    quantityGathered: data.quantityGathered,
    location: data.location,
    gatheredBy: data.gatheredBy,
    gatheredAt: new Date(data.gatheredAt),
    photo: data.photo
});

// Helper function to create verified items
const createVerifiedItem = (id, data) => ({
    _id: `verify_${id}`,
    product: data.product,
    sku: data.sku,
    name: data.name,
    photo: data.photo,
    quantityVerified: data.quantityVerified,
    scanTimestamp: new Date(data.scanTimestamp),
    scanDevice: data.scanDevice,
    scannedBy: data.scannedBy,
    mismatch: data.mismatch || { detected: false }
});

// Create packaging tasks
const createTask1 = () => {
    const now = new Date();
    const task = {
        _id: "pkg_001",
        taskId: "PKG-2024-000001",
        order: "ord_001",
        document: "doc_001",
        assignedTo: "ST-004",
        supervisedBy: null,
        priority: PackagingPriority.HIGH,
        scheduledFor: new Date(),
        deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        
        stages: {
            preparation: {
                status: StageStatus.COMPLETED,
                startedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
                completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                durationMinutes: 60,
                notes: '',
                location: "PACK-01",
                itemsGathered: [
                    createGatheredItem("001", {
                        product: "prod_001",
                        sku: "ALB-WED-CLASSIC",
                        name: "Classic Leather Wedding Album",
                        quantityRequired: 1,
                        quantityGathered: 1,
                        location: "Aisle 3, Shelf B",
                        gatheredBy: "ST-004",
                        gatheredAt: new Date(now.getTime() - 3 * 60 * 60 * 1000 + 15 * 60 * 1000),
                        photo: "https://storage.example.com/gathered/alb_wed_classic.jpg"
                    }),
                    createGatheredItem("002", {
                        product: "prod_007",
                        sku: "CANVAS-SM-8X10",
                        name: "Small Canvas Print 8x10",
                        quantityRequired: 2,
                        quantityGathered: 2,
                        location: "Aisle 2, Shelf A",
                        gatheredBy: "ST-004",
                        gatheredAt: new Date(now.getTime() - 3 * 60 * 60 * 1000 + 30 * 60 * 1000),
                        photo: "https://storage.example.com/gathered/canvas_sm.jpg"
                    })
                ],
                pickListPrinted: true,
                pickListPrintedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
            },
            verification: {
                status: StageStatus.COMPLETED,
                startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                completedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
                durationMinutes: 30,
                notes: '',
                verifiedBy: "ST-001",
                itemChecks: [
                    createVerifiedItem("001", {
                        product: "prod_001",
                        sku: "ALB-WED-CLASSIC",
                        name: "Classic Leather Wedding Album",
                        photo: "https://storage.example.com/verification/alb_wed_classic_scan.jpg",
                        quantityVerified: 1,
                        scanTimestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
                        scanDevice: "SCANNER-01",
                        scannedBy: "ST-001",
                        mismatch: { detected: false }
                    }),
                    createVerifiedItem("002", {
                        product: "prod_007",
                        sku: "CANVAS-SM-8X10",
                        name: "Small Canvas Print 8x10",
                        photo: "https://storage.example.com/verification/canvas_sm_scan.jpg",
                        quantityVerified: 2,
                        scanTimestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
                        scanDevice: "SCANNER-01",
                        scannedBy: "ST-001",
                        mismatch: { detected: false }
                    })
                ],
                allItemsVerified: true,
                verificationMethod: VerificationMethod.BARCODE_SCAN,
                overrideReason: '',
                packagingMaterials: {
                    boxType: "MEDIUM-BOX",
                    weight: 2.5,
                    dimensions: { length: 30, width: 25, height: 15 },
                    fragile: true,
                    specialHandling: '',
                    cushioning: "Bubble wrap",
                    cost: 2.50
                },
                packagePhoto: "https://storage.example.com/packages/package_001.jpg"
            },
            labeling: {
                status: StageStatus.COMPLETED,
                startedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
                completedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                durationMinutes: 30,
                notes: '',
                labels: {
                    destination: {
                        printed: true,
                        printedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000 + 5 * 60 * 1000),
                        barcode: "TRK-2024-123456",
                        qrCodeData: "https://track.linkchem.co.ke/TRK-2024-123456",
                        destination: {
                            name: "Johnson Family Residence",
                            address: "123 Main St, Westlands, Nairobi",
                            contactPhone: "+254 722 334455",
                            contactName: "Michael Johnson",
                            deliveryInstructions: "Gate code: 1234"
                        },
                        scannedConfirmation: true,
                        scannedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000 + 10 * 60 * 1000),
                        scannedBy: "ST-004",
                        labelPhoto: "https://storage.example.com/labels/label_001.jpg"
                    },
                    content: {
                        orderNumber: "ORD-2024-000001",
                        documentNumber: "INV-2024-001234",
                        itemCount: 2,
                        totalValue: 440.77,
                        fragileWarnings: 1,
                        specialInstructions: ["Handle with care", "Contains fragile items"]
                    },
                    return: null
                },
                labelVerificationPhoto: "https://storage.example.com/labels/verification_001.jpg"
            },
            handoff: {
                status: StageStatus.COMPLETED,
                startedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                completedAt: new Date(now.getTime() - 30 * 60 * 1000),
                durationMinutes: 30,
                notes: '',
                handedTo: "ST-005",
                handoffMethod: HandoffMethod.INTERNAL_DRIVER,
                courierName: "Sarah Johnson",
                courierTrackingNumber: "TRK-2024-123456",
                vehicleInfo: "KBC 123X - White Van",
                confirmation: {
                    photo: "https://storage.example.com/handoff/handoff_001.jpg",
                    signature: "",
                    signatureName: "",
                    pinCode: "",
                    recipientName: "Sarah Johnson",
                    recipientPhone: "+254 766 555666",
                    timestamp: new Date(now.getTime() - 30 * 60 * 1000),
                    gpsLocation: {
                        lat: -1.2621,
                        lng: 36.8123,
                        accuracy: 5
                    },
                    notes: "Package handed to driver"
                },
                clientNotified: true,
                notificationSentAt: new Date(now.getTime() - 25 * 60 * 1000)
            }
        },
        
        exceptions: [],
        currentException: null,
        
        quality: {
            packingTimeMinutes: 180,
            preparationTimeMinutes: 60,
            verificationTimeMinutes: 30,
            labelingTimeMinutes: 30,
            accuracyScore: 100,
            mismatchesCount: 0,
            damageReported: false,
            damageDetails: '',
            clientFeedback: '',
            clientRating: null,
            redeliveryRequired: false,
            redeliveryReason: ''
        },
        
        overallStatus: PackagingStatus.HANDED_OFF,
        previousStatus: null,
        statusHistory: [
            {
                status: PackagingStatus.QUEUED,
                changedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
                changedBy: "ST-001",
                reason: "Task created"
            },
            {
                status: PackagingStatus.PREPARING,
                changedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
                changedBy: "ST-004",
                reason: "Started preparation"
            },
            {
                status: PackagingStatus.VERIFYING,
                changedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                changedBy: "ST-001",
                reason: "Preparation complete, starting verification"
            },
            {
                status: PackagingStatus.LABELING,
                changedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
                changedBy: "ST-001",
                reason: "Verification complete"
            },
            {
                status: PackagingStatus.READY,
                changedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                changedBy: "ST-004",
                reason: "Labeling complete, package ready"
            },
            {
                status: PackagingStatus.HANDED_OFF,
                changedAt: new Date(now.getTime() - 30 * 60 * 1000),
                changedBy: "ST-004",
                reason: "Handed to driver"
            }
        ],
        
        deliveryTracking: {
            trackingNumber: "TRK-2024-123456",
            courier: "Internal",
            estimatedDelivery: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
            actualDelivery: null,
            deliveryAttempts: 0,
            currentLocation: "In transit"
        },
        
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        updatedAt: now,
        completedAt: null,
        createdBy: "ST-001"
    };
    
    return task;
};

const createTask2 = () => {
    const now = new Date();
    const task = {
        _id: "pkg_002",
        taskId: "PKG-2024-000002",
        order: "ord_002",
        document: "doc_002",
        assignedTo: "ST-004",
        supervisedBy: null,
        priority: PackagingPriority.URGENT,
        scheduledFor: new Date(),
        deadline: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        
        stages: {
            preparation: {
                status: StageStatus.IN_PROGRESS,
                startedAt: new Date(now.getTime() - 45 * 60 * 1000),
                completedAt: null,
                durationMinutes: null,
                notes: '',
                location: "PACK-01",
                itemsGathered: [
                    createGatheredItem("003", {
                        product: "prod_004",
                        sku: "BOOK-PHOTO-STD",
                        name: "Standard Photo Book",
                        quantityRequired: 10,
                        quantityGathered: 8,
                        location: "Aisle 1, Shelf C",
                        gatheredBy: "ST-004",
                        gatheredAt: new Date(now.getTime() - 30 * 60 * 1000),
                        photo: "https://storage.example.com/gathered/book_std.jpg"
                    })
                ],
                pickListPrinted: true,
                pickListPrintedAt: new Date(now.getTime() - 45 * 60 * 1000)
            },
            verification: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                verifiedBy: null,
                itemChecks: [],
                allItemsVerified: false,
                verificationMethod: VerificationMethod.BARCODE_SCAN,
                overrideReason: '',
                packagingMaterials: {},
                packagePhoto: ''
            },
            labeling: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                labels: {
                    destination: {},
                    content: {},
                    return: null
                },
                labelVerificationPhoto: ''
            },
            handoff: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                handedTo: null,
                handoffMethod: HandoffMethod.INTERNAL_DRIVER,
                courierName: '',
                courierTrackingNumber: '',
                vehicleInfo: '',
                confirmation: {},
                clientNotified: false,
                notificationSentAt: null
            }
        },
        
        exceptions: [
            {
                _id: "exc_001",
                exceptionType: ExceptionType.STOCK_SHORTAGE,
                detectedAt: new Date(now.getTime() - 20 * 60 * 1000),
                detectedBy: "ST-004",
                description: "Standard Photo Book only 8 available, need 10",
                severity: ExceptionSeverity.HIGH,
                stage: "PREPARATION",
                resolution: {
                    status: "RESOLVED",
                    resolvedBy: "ST-002",
                    resolvedAt: new Date(now.getTime() - 10 * 60 * 1000),
                    action: ResolutionAction.SOURCE_ALTERNATIVE,
                    actionNotes: "Sourced from alternative supplier, will arrive tomorrow",
                    newTaskCreated: null,
                    clientNotified: true,
                    notificationSentAt: new Date(now.getTime() - 5 * 60 * 1000)
                },
                photos: ["https://storage.example.com/exceptions/shortage_001.jpg"],
                supervisorNotes: "Approved alternative sourcing"
            }
        ],
        currentException: "exc_001",
        
        quality: {
            packingTimeMinutes: 0,
            preparationTimeMinutes: 45,
            verificationTimeMinutes: null,
            labelingTimeMinutes: null,
            accuracyScore: 100,
            mismatchesCount: 0,
            damageReported: false,
            damageDetails: '',
            clientFeedback: '',
            clientRating: null,
            redeliveryRequired: false,
            redeliveryReason: ''
        },
        
        overallStatus: PackagingStatus.PREPARING,
        previousStatus: null,
        statusHistory: [
            {
                status: PackagingStatus.QUEUED,
                changedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                changedBy: "ST-002",
                reason: "Task created"
            },
            {
                status: PackagingStatus.PREPARING,
                changedAt: new Date(now.getTime() - 45 * 60 * 1000),
                changedBy: "ST-004",
                reason: "Started preparation"
            },
            {
                status: PackagingStatus.EXCEPTION,
                changedAt: new Date(now.getTime() - 20 * 60 * 1000),
                changedBy: "ST-004",
                reason: "STOCK_SHORTAGE: Standard Photo Book only 8 available, need 10"
            },
            {
                status: PackagingStatus.PREPARING,
                changedAt: new Date(now.getTime() - 10 * 60 * 1000),
                changedBy: "ST-002",
                reason: "Exception resolved: SOURCE_ALTERNATIVE"
            }
        ],
        
        deliveryTracking: null,
        
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        updatedAt: now,
        completedAt: null,
        createdBy: "ST-002"
    };
    
    return task;
};

const createTask3 = () => {
    const now = new Date();
    const task = {
        _id: "pkg_003",
        taskId: "PKG-2024-000003",
        order: "ord_003",
        document: "doc_003",
        assignedTo: "ST-001",
        supervisedBy: null,
        priority: PackagingPriority.NORMAL,
        scheduledFor: new Date(),
        deadline: new Date(now.getTime() + 5 * 60 * 60 * 1000),
        
        stages: {
            preparation: {
                status: StageStatus.COMPLETED,
                startedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
                completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                durationMinutes: 60,
                notes: '',
                location: "PACK-02",
                itemsGathered: [
                    createGatheredItem("004", {
                        product: "prod_009",
                        sku: "CANVAS-LG-24X36",
                        name: "Large Canvas Print 24x36",
                        quantityRequired: 3,
                        quantityGathered: 3,
                        location: "Aisle 2, Shelf A",
                        gatheredBy: "ST-001",
                        gatheredAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
                        photo: "https://storage.example.com/gathered/canvas_lg.jpg"
                    })
                ],
                pickListPrinted: true,
                pickListPrintedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
            },
            verification: {
                status: StageStatus.IN_PROGRESS,
                startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                completedAt: null,
                durationMinutes: null,
                notes: '',
                verifiedBy: "ST-001",
                itemChecks: [
                    createVerifiedItem("003", {
                        product: "prod_009",
                        sku: "CANVAS-LG-24X36",
                        name: "Large Canvas Print 24x36",
                        photo: "https://storage.example.com/verification/canvas_lg_01.jpg",
                        quantityVerified: 2,
                        scanTimestamp: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
                        scanDevice: "SCANNER-02",
                        scannedBy: "ST-001",
                        mismatch: { detected: false }
                    })
                ],
                allItemsVerified: false,
                verificationMethod: VerificationMethod.BARCODE_SCAN,
                overrideReason: '',
                packagingMaterials: {},
                packagePhoto: ''
            },
            labeling: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                labels: {
                    destination: {},
                    content: {},
                    return: null
                },
                labelVerificationPhoto: ''
            },
            handoff: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                handedTo: null,
                handoffMethod: HandoffMethod.INTERNAL_DRIVER,
                courierName: '',
                courierTrackingNumber: '',
                vehicleInfo: '',
                confirmation: {},
                clientNotified: false,
                notificationSentAt: null
            }
        },
        
        exceptions: [],
        currentException: null,
        
        quality: {
            packingTimeMinutes: 0,
            preparationTimeMinutes: 60,
            verificationTimeMinutes: null,
            labelingTimeMinutes: null,
            accuracyScore: 100,
            mismatchesCount: 0,
            damageReported: false,
            damageDetails: '',
            clientFeedback: '',
            clientRating: null,
            redeliveryRequired: false,
            redeliveryReason: ''
        },
        
        overallStatus: PackagingStatus.VERIFYING,
        previousStatus: null,
        statusHistory: [
            {
                status: PackagingStatus.QUEUED,
                changedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
                changedBy: "ST-002",
                reason: "Task created"
            },
            {
                status: PackagingStatus.PREPARING,
                changedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
                changedBy: "ST-001",
                reason: "Started preparation"
            },
            {
                status: PackagingStatus.VERIFYING,
                changedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                changedBy: "ST-001",
                reason: "Preparation complete, starting verification"
            }
        ],
        
        deliveryTracking: null,
        
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        updatedAt: now,
        completedAt: null,
        createdBy: "ST-002"
    };
    
    return task;
};

const createTask4 = () => {
    const now = new Date();
    const task = {
        _id: "pkg_004",
        taskId: "PKG-2024-000004",
        order: "ord_004",
        document: "doc_004",
        assignedTo: null,
        supervisedBy: null,
        priority: PackagingPriority.NORMAL,
        scheduledFor: new Date(),
        deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        
        stages: {
            preparation: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                location: '',
                itemsGathered: [],
                pickListPrinted: false,
                pickListPrintedAt: null
            },
            verification: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                verifiedBy: null,
                itemChecks: [],
                allItemsVerified: false,
                verificationMethod: VerificationMethod.BARCODE_SCAN,
                overrideReason: '',
                packagingMaterials: {},
                packagePhoto: ''
            },
            labeling: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                labels: {
                    destination: {},
                    content: {},
                    return: null
                },
                labelVerificationPhoto: ''
            },
            handoff: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                handedTo: null,
                handoffMethod: HandoffMethod.INTERNAL_DRIVER,
                courierName: '',
                courierTrackingNumber: '',
                vehicleInfo: '',
                confirmation: {},
                clientNotified: false,
                notificationSentAt: null
            }
        },
        
        exceptions: [],
        currentException: null,
        
        quality: {
            packingTimeMinutes: 0,
            preparationTimeMinutes: null,
            verificationTimeMinutes: null,
            labelingTimeMinutes: null,
            accuracyScore: 100,
            mismatchesCount: 0,
            damageReported: false,
            damageDetails: '',
            clientFeedback: '',
            clientRating: null,
            redeliveryRequired: false,
            redeliveryReason: ''
        },
        
        overallStatus: PackagingStatus.QUEUED,
        previousStatus: null,
        statusHistory: [
            {
                status: PackagingStatus.QUEUED,
                changedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
                changedBy: "ST-001",
                reason: "Task created"
            }
        ],
        
        deliveryTracking: null,
        
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: now,
        completedAt: null,
        createdBy: "ST-001"
    };
    
    return task;
};

const createTask5 = () => {
    const now = new Date();
    const task = {
        _id: "pkg_005",
        taskId: "PKG-2024-000005",
        order: "ord_005",
        document: "doc_005",
        assignedTo: null,
        supervisedBy: null,
        priority: PackagingPriority.HIGH,
        scheduledFor: new Date(),
        deadline: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        
        stages: {
            preparation: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                location: '',
                itemsGathered: [],
                pickListPrinted: false,
                pickListPrintedAt: null
            },
            verification: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                verifiedBy: null,
                itemChecks: [],
                allItemsVerified: false,
                verificationMethod: VerificationMethod.BARCODE_SCAN,
                overrideReason: '',
                packagingMaterials: {},
                packagePhoto: ''
            },
            labeling: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                labels: {
                    destination: {},
                    content: {},
                    return: null
                },
                labelVerificationPhoto: ''
            },
            handoff: {
                status: StageStatus.PENDING,
                startedAt: null,
                completedAt: null,
                durationMinutes: null,
                notes: '',
                handedTo: null,
                handoffMethod: HandoffMethod.INTERNAL_DRIVER,
                courierName: '',
                courierTrackingNumber: '',
                vehicleInfo: '',
                confirmation: {},
                clientNotified: false,
                notificationSentAt: null
            }
        },
        
        exceptions: [],
        currentException: null,
        
        quality: {
            packingTimeMinutes: 0,
            preparationTimeMinutes: null,
            verificationTimeMinutes: null,
            labelingTimeMinutes: null,
            accuracyScore: 100,
            mismatchesCount: 0,
            damageReported: false,
            damageDetails: '',
            clientFeedback: '',
            clientRating: null,
            redeliveryRequired: false,
            redeliveryReason: ''
        },
        
        overallStatus: PackagingStatus.QUEUED,
        previousStatus: null,
        statusHistory: [
            {
                status: PackagingStatus.QUEUED,
                changedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
                changedBy: "ST-003",
                reason: "Task created"
            }
        ],
        
        deliveryTracking: null,
        
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        updatedAt: now,
        completedAt: null,
        createdBy: "ST-003"
    };
    
    return task;
};

// Create all tasks
const dummyPackagingTasks = [
    createTask1(),
    createTask2(),
    createTask3(),
    createTask4(),
    createTask5()
];

// Delivery Points
const dummyDeliveryPoints = [
    {
        _id: "dp_001",
        client: "CL-001",
        name: "Johnson Family Residence",
        type: DeliveryPointType.RESIDENTIAL,
        address: {
            street: "123 Muthaiga Road",
            building: "Johnson Residence",
            city: "Nairobi",
            county: "Nairobi",
            country: "Kenya",
            coordinates: {
                lat: -1.2621,
                lng: 36.8123
            }
        },
        contact: {
            name: "Michael Johnson",
            phone: "+254722334455",
            email: "michael@johnsonphoto.com"
        },
        access: {
            gateCode: "1234",
            callBeforeArrival: true,
            parkingInstructions: "Park on driveway",
            deliveryHours: {
                monday: { start: "09:00", end: "17:00" },
                tuesday: { start: "09:00", end: "17:00" },
                wednesday: { start: "09:00", end: "17:00" },
                thursday: { start: "09:00", end: "17:00" },
                friday: { start: "09:00", end: "17:00" },
                saturday: { start: "10:00", end: "14:00" },
                sunday: { start: "00:00", end: "00:00" }
            }
        },
        deliveryHistory: {
            successfulDeliveries: 3,
            failedAttempts: 0,
            averageDeliveryTimeMinutes: 25,
            lastDeliveryDate: new Date("2024-01-14T15:30:00Z"),
            commonIssues: []
        },
        isDefault: true,
        isActive: true,
        requiresSpecialHandling: false,
        createdAt: new Date("2023-01-15T08:00:00Z"),
        updatedAt: new Date("2024-01-18T14:30:00Z")
    },
    {
        _id: "dp_002",
        client: "CL-001",
        name: "Johnson Studio",
        type: DeliveryPointType.OWN_SHOP,
        address: {
            street: "456 Kimathi Street",
            building: "Ambassador House",
            floor: "2nd Floor",
            city: "Nairobi",
            country: "Kenya"
        },
        contact: {
            name: "Reception",
            phone: "+254203334455"
        },
        access: {
            securityCall: true,
            deliveryHours: {
                monday: { start: "08:00", end: "18:00" },
                tuesday: { start: "08:00", end: "18:00" },
                wednesday: { start: "08:00", end: "18:00" },
                thursday: { start: "08:00", end: "18:00" },
                friday: { start: "08:00", end: "18:00" },
                saturday: { start: "09:00", end: "15:00" },
                sunday: { start: "00:00", end: "00:00" }
            }
        },
        deliveryHistory: {
            successfulDeliveries: 5,
            failedAttempts: 0,
            averageDeliveryTimeMinutes: 15,
            lastDeliveryDate: new Date("2024-01-10T11:30:00Z")
        },
        isDefault: false,
        isActive: true,
        requiresSpecialHandling: false,
        createdAt: new Date("2023-03-20T09:00:00Z"),
        updatedAt: new Date("2024-01-18T14:30:00Z")
    },
    {
        _id: "dp_003",
        client: "CL-002",
        name: "Smith Wedding Venue",
        type: DeliveryPointType.CLIENT_OFFICE,
        address: {
            street: "78 Karen Road",
            city: "Nairobi",
            country: "Kenya",
            coordinates: {
                lat: -1.3176,
                lng: 36.7182
            }
        },
        contact: {
            name: "Emma Smith",
            phone: "+254711223344"
        },
        access: {
            instructions: "Deliver to event coordinator at reception"
        },
        deliveryHistory: {
            successfulDeliveries: 2,
            failedAttempts: 0,
            averageDeliveryTimeMinutes: 20
        },
        isDefault: true,
        isActive: true,
        requiresSpecialHandling: false,
        createdAt: new Date("2023-03-10T09:00:00Z"),
        updatedAt: new Date("2024-01-18T14:30:00Z")
    }
];

// Packing Stations
const dummyPackingStations = [
    {
        _id: "station_001",
        stationId: "PACK-01",
        name: "Station A - Main Warehouse",
        location: "Warehouse A, Section 1",
        isActive: true,
        equipment: [
            {
                type: "BARCODE_SCANNER",
                deviceId: "SCAN-001",
                serialNumber: "SN123456",
                lastCalibrated: new Date("2024-01-15T08:00:00Z"),
                isOperational: true,
                lastMaintenance: new Date("2024-01-10T09:00:00Z")
            },
            {
                type: "LABEL_PRINTER",
                deviceId: "PRN-001",
                serialNumber: "SN789012",
                lastCalibrated: new Date("2024-01-15T08:00:00Z"),
                isOperational: true,
                lastMaintenance: new Date("2024-01-10T09:00:00Z")
            },
            {
                type: "SCALE",
                deviceId: "SCL-001",
                serialNumber: "SN345678",
                lastCalibrated: new Date("2024-01-14T10:00:00Z"),
                isOperational: true
            },
            {
                type: "CAMERA",
                deviceId: "CAM-001",
                serialNumber: "SN901234",
                lastCalibrated: new Date("2024-01-15T08:00:00Z"),
                isOperational: true
            }
        ],
        assignedStaff: ["ST-004", "ST-005"],
        currentTask: "pkg_001",
        queue: ["pkg_002"],
        capacity: 2,
        tasksCompletedToday: 12,
        averageTaskTimeMinutes: 45,
        createdAt: new Date("2023-01-01T08:00:00Z"),
        updatedAt: new Date("2024-01-18T14:30:00Z")
    },
    {
        _id: "station_002",
        stationId: "PACK-02",
        name: "Station B - Express Area",
        location: "Warehouse B, Express Zone",
        isActive: true,
        equipment: [
            {
                type: "BARCODE_SCANNER",
                deviceId: "SCAN-002",
                serialNumber: "SN223344",
                lastCalibrated: new Date("2024-01-15T09:00:00Z"),
                isOperational: true
            },
            {
                type: "LABEL_PRINTER",
                deviceId: "PRN-002",
                serialNumber: "SN556677",
                lastCalibrated: new Date("2024-01-15T09:00:00Z"),
                isOperational: true
            }
        ],
        assignedStaff: ["ST-001"],
        currentTask: null,
        queue: ["pkg_003"],
        capacity: 1,
        tasksCompletedToday: 8,
        averageTaskTimeMinutes: 35,
        createdAt: new Date("2023-06-01T08:00:00Z"),
        updatedAt: new Date("2024-01-18T14:30:00Z")
    }
];

// Packaging Stats
const packagingStats = {
    date: new Date(),
    totalTasks: 5,
    byStatus: {
        [PackagingStatus.QUEUED]: 2,
        [PackagingStatus.PREPARING]: 1,
        [PackagingStatus.VERIFYING]: 1,
        [PackagingStatus.READY]: 0,
        [PackagingStatus.HANDED_OFF]: 1,
        [PackagingStatus.EXCEPTION]: 0
    },
    byPriority: {
        [PackagingPriority.NORMAL]: 2,
        [PackagingPriority.HIGH]: 2,
        [PackagingPriority.URGENT]: 1
    },
    metrics: {
        averagePackingTime: 45,
        accuracyRate: 98,
        exceptionRate: 20,
        onTimeDeliveryRate: 80
    },
    stationUtilization: {
        totalStations: 2,
        activeStations: 2,
        tasksInProgress: 2,
        tasksQueued: 2
    },
    alerts: {
        overdueTasks: 1,
        exceptionsOpen: 0,
        urgentTasks: 1
    }
};

// Packaging Queue
const dummyPackagingQueue = [
    {
        taskId: "PKG-2024-000002",
        orderNumber: "ORD-2024-000002",
        clientName: "Smith Wedding",
        priority: PackagingPriority.URGENT,
        status: PackagingStatus.PREPARING,
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
        assignedTo: "ST-004",
        station: "PACK-01",
        items: 1
    },
    {
        taskId: "PKG-2024-000003",
        orderNumber: "ORD-2024-000003",
        clientName: "Davis Portrait",
        priority: PackagingPriority.NORMAL,
        status: PackagingStatus.VERIFYING,
        deadline: new Date(Date.now() + 5 * 60 * 60 * 1000),
        assignedTo: "ST-001",
        station: "PACK-02",
        items: 1
    },
    {
        taskId: "PKG-2024-000004",
        orderNumber: "ORD-2024-000004",
        clientName: "Wilson Family",
        priority: PackagingPriority.NORMAL,
        status: PackagingStatus.QUEUED,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        assignedTo: null,
        station: null,
        items: 1
    },
    {
        taskId: "PKG-2024-000005",
        orderNumber: "ORD-2024-000005",
        clientName: "Brown & Co",
        priority: PackagingPriority.HIGH,
        status: PackagingStatus.QUEUED,
        deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
        assignedTo: null,
        station: null,
        items: 2
    }
];

// Exceptions Log
const dummyExceptions = [
    {
        _id: "exc_001",
        taskId: "PKG-2024-000002",
        orderNumber: "ORD-2024-000002",
        type: ExceptionType.STOCK_SHORTAGE,
        severity: ExceptionSeverity.HIGH,
        description: "Standard Photo Book only 8 available, need 10",
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "RESOLVED",
        resolvedBy: "ST-002",
        resolution: ResolutionAction.SOURCE_ALTERNATIVE
    }
];

async function seedPackaging() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            PackagingTask.deleteMany({}),
            DeliveryPoint.deleteMany({}),
            PackingStation.deleteMany({}),
            PackagingStats.deleteMany({}),
            PackagingQueue.deleteMany({}),
            ExceptionsLog.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Packaging Tasks
        console.log('📦 Seeding packaging tasks...');
        await PackagingTask.insertMany(dummyPackagingTasks);
        console.log(`✅ ${dummyPackagingTasks.length} packaging tasks seeded`);

        // Seed Delivery Points
        console.log('📍 Seeding delivery points...');
        await DeliveryPoint.insertMany(dummyDeliveryPoints);
        console.log(`✅ ${dummyDeliveryPoints.length} delivery points seeded`);

        // Seed Packing Stations
        console.log('🏭 Seeding packing stations...');
        await PackingStation.insertMany(dummyPackingStations);
        console.log(`✅ ${dummyPackingStations.length} packing stations seeded`);

        // Seed Packaging Stats
        console.log('📊 Seeding packaging statistics...');
        await PackagingStats.create(packagingStats);
        console.log('✅ Packaging statistics seeded');

        // Seed Packaging Queue
        console.log('📋 Seeding packaging queue...');
        await PackagingQueue.insertMany(dummyPackagingQueue);
        console.log(`✅ ${dummyPackagingQueue.length} queue items seeded`);

        // Seed Exceptions Log
        console.log('⚠️ Seeding exceptions log...');
        if (dummyExceptions.length > 0) {
            await ExceptionsLog.insertMany(dummyExceptions);
            console.log(`✅ ${dummyExceptions.length} exceptions logged`);
        } else {
            console.log('✅ No exceptions to log');
        }

        // Verify counts
        const counts = await Promise.all([
            PackagingTask.countDocuments(),
            DeliveryPoint.countDocuments(),
            PackingStation.countDocuments(),
            PackagingStats.countDocuments(),
            PackagingQueue.countDocuments(),
            ExceptionsLog.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Packaging Tasks: ${counts[0]}`);
        console.log(`   Delivery Points: ${counts[1]}`);
        console.log(`   Packing Stations: ${counts[2]}`);
        console.log(`   Packaging Stats: ${counts[3]}`);
        console.log(`   Packaging Queue: ${counts[4]}`);
        console.log(`   Exceptions Log: ${counts[5]}`);

        // Status breakdown
        const statusBreakdown = await PackagingTask.aggregate([
            {
                $group: {
                    _id: "$overallStatus",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (statusBreakdown.length > 0) {
            console.log('\n📈 Status Breakdown:');
            statusBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} task(s)`);
            });
        }

        // Priority breakdown
        const priorityBreakdown = await PackagingTask.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (priorityBreakdown.length > 0) {
            console.log('\n⚡ Priority Breakdown:');
            priorityBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} task(s)`);
            });
        }

        // Station utilization
        const stationStats = await PackingStation.aggregate([
            {
                $group: {
                    _id: null,
                    totalStations: { $sum: 1 },
                    activeStations: { $sum: { $cond: ["$isActive", 1, 0] } },
                    tasksInProgress: { $sum: { $cond: [{ $ne: ["$currentTask", null] }, 1, 0] } },
                    totalQueued: { $sum: { $size: "$queue" } }
                }
            }
        ]);

        if (stationStats.length > 0) {
            console.log('\n🏭 Station Utilization:');
            console.log(`   Total Stations: ${stationStats[0].totalStations}`);
            console.log(`   Active Stations: ${stationStats[0].activeStations}`);
            console.log(`   Tasks In Progress: ${stationStats[0].tasksInProgress}`);
            console.log(`   Tasks Queued: ${stationStats[0].totalQueued}`);
        }

        console.log('\n✅ Packaging seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding packaging:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedPackaging();