// scripts/seed-orders.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Order,
    OrderStats,
    PackagingQueue,
    OrderStatus,
    PaymentMethod,
    MessageFromModel,
    MessageType
} from '../models/order.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Dummy orders data (from your existing code)
const dummyOrders = [
    {
        "_id": "ord_001",
        "orderNumber": "ORD-2024-000001",
        "client": "CL-001",
        
        "destination": {
            "deliveryPointId": "dp_001",
            "name": "Johnson Family Residence",
            "address": "123 Main St, Westlands, Nairobi",
            "contactName": "Michael Johnson",
            "contactPhone": "+254 722 334455",
            "instructions": "Gate code: 1234. Leave with security if not home",
            "coordinates": {
                "lat": -1.2621,
                "lng": 36.8123
            }
        },
        
        "items": [
            {
                "_id": "item_001",
                "product": "prod_001",
                "sku": "ALB-WED-CLASSIC",
                "name": "Classic Leather Wedding Album",
                "description": "Leather-bound album with 20 pages",
                "category": "Wedding Albums",
                "quantity": 1,
                "unitPrice": 299.99,
                "total": 299.99,
                "verified": {
                    "scanned": true,
                    "scannedAt": new Date("2024-01-16T10:30:00Z"),
                    "scannedBy": "ST-004",
                    "photoUrl": "https://storage.example.com/verification/ord_001_item_001.jpg",
                    "notes": "Perfect condition"
                },
                "reservedQuantity": 1
            },
            {
                "_id": "item_002",
                "product": "prod_007",
                "sku": "CANVAS-SM-8X10",
                "name": "Small Canvas Print 8x10",
                "description": "Gallery-wrapped canvas print",
                "category": "Canvas Prints",
                "quantity": 2,
                "unitPrice": 39.99,
                "total": 79.98,
                "verified": {
                    "scanned": true,
                    "scannedAt": new Date("2024-01-16T10:32:00Z"),
                    "scannedBy": "ST-004",
                    "photoUrl": "https://storage.example.com/verification/ord_001_item_002.jpg",
                    "notes": ""
                },
                "reservedQuantity": 2
            }
        ],
        
        "subtotal": 379.97,
        "taxRate": 16,
        "tax": 60.80,
        "total": 440.77,
        "deposit": 200.00,
        "balance": 240.77,
        "payments": [
            {
                "_id": "pay_001",
                "method": PaymentMethod.MPESA,
                "reference": "QK7X9P2M",
                "amount": 200.00,
                "paidAt": new Date("2024-01-15T14:30:00Z"),
                "paidBy": "Michael Johnson",
                "verifiedBy": "ST-001"
            }
        ],
        
        "status": OrderStatus.PACKING,
        "statusHistory": [
            {
                "status": OrderStatus.DRAFT,
                "changedAt": new Date("2024-01-15T09:00:00Z"),
                "changedBy": "ST-001",
                "reason": "Order created"
            },
            {
                "status": OrderStatus.CONFIRMED,
                "changedAt": new Date("2024-01-15T10:15:00Z"),
                "changedBy": "ST-001",
                "reason": "Payment received, stock verified"
            },
            {
                "status": OrderStatus.PACKING,
                "changedAt": new Date("2024-01-16T08:00:00Z"),
                "changedBy": "ST-004",
                "reason": "Packaging started"
            }
        ],
        
        "createdBy": "ST-001",
        "assignedTo": "ST-004",
        "approvedBy": null,
        
        "orderDate": new Date("2024-01-15T09:00:00Z"),
        "requestedDeliveryDate": new Date("2024-01-20T00:00:00Z"),
        "promisedDeliveryDate": new Date("2024-01-18T00:00:00Z"),
        "actualDeliveryDate": null,
        
        "messages": [
            {
                "_id": "msg_001",
                "from": "ST-001",
                "fromModel": MessageFromModel.STAFF,
                "text": "Your order has been confirmed. We'll start processing immediately.",
                "timestamp": new Date("2024-01-15T10:16:00Z"),
                "isInternal": false,
                "attachments": [],
                "messageType": MessageType.STATUS_UPDATE
            },
            {
                "_id": "msg_002",
                "from": "ST-004",
                "fromModel": MessageFromModel.STAFF,
                "text": "Packaging started. Items look great!",
                "timestamp": new Date("2024-01-16T08:05:00Z"),
                "isInternal": true,
                "attachments": [],
                "messageType": MessageType.TEXT
            }
        ],
        
        "generatedDocuments": [],
        
        "version": 3,
        "isLocked": true,
        "cancellationReason": "",
        "createdAt": new Date("2024-01-15T09:00:00Z"),
        "updatedAt": new Date("2024-01-16T08:00:00Z")
    },
    {
        "_id": "ord_002",
        "orderNumber": "ORD-2024-000002",
        "client": "CL-002",
        
        "destination": {
            "deliveryPointId": "dp_002",
            "name": "Smith Wedding Venue",
            "address": "45 Karen Road, Karen, Nairobi",
            "contactName": "Emma Smith",
            "contactPhone": "+254 711 223344",
            "instructions": "Deliver to event coordinator at reception",
            "coordinates": {
                "lat": -1.3176,
                "lng": 36.7182
            }
        },
        
        "items": [
            {
                "_id": "item_003",
                "product": "prod_004",
                "sku": "BOOK-PHOTO-STD",
                "name": "Standard Photo Book",
                "description": "Softcover, 20 pages",
                "category": "Photo Books",
                "quantity": 10,
                "unitPrice": 49.99,
                "total": 499.90,
                "verified": {
                    "scanned": false,
                    "scannedAt": null,
                    "scannedBy": null,
                    "photoUrl": "",
                    "notes": ""
                },
                "reservedQuantity": 10
            }
        ],
        
        "subtotal": 499.90,
        "taxRate": 16,
        "tax": 79.98,
        "total": 579.88,
        "deposit": 0,
        "balance": 579.88,
        "payments": [],
        
        "status": OrderStatus.CONFIRMED,
        "statusHistory": [
            {
                "status": OrderStatus.DRAFT,
                "changedAt": new Date("2024-01-16T11:00:00Z"),
                "changedBy": "ST-002",
                "reason": "Order created"
            },
            {
                "status": OrderStatus.CONFIRMED,
                "changedAt": new Date("2024-01-16T11:30:00Z"),
                "changedBy": "ST-002",
                "reason": "Stock verified"
            }
        ],
        
        "createdBy": "ST-002",
        "assignedTo": null,
        "approvedBy": null,
        
        "orderDate": new Date("2024-01-16T11:00:00Z"),
        "requestedDeliveryDate": new Date("2024-01-25T00:00:00Z"),
        "promisedDeliveryDate": new Date("2024-01-23T00:00:00Z"),
        "actualDeliveryDate": null,
        
        "messages": [
            {
                "_id": "msg_003",
                "from": "ST-002",
                "fromModel": MessageFromModel.STAFF,
                "text": "Order confirmed. Ready for packaging.",
                "timestamp": new Date("2024-01-16T11:31:00Z"),
                "isInternal": true,
                "attachments": [],
                "messageType": MessageType.STATUS_UPDATE
            }
        ],
        
        "generatedDocuments": [],
        
        "version": 2,
        "isLocked": true,
        "cancellationReason": "",
        "createdAt": new Date("2024-01-16T11:00:00Z"),
        "updatedAt": new Date("2024-01-16T11:30:00Z")
    },
    {
        "_id": "ord_003",
        "orderNumber": "ORD-2024-000003",
        "client": "CL-003",
        
        "destination": {
            "deliveryPointId": "dp_003",
            "name": "Davis Portrait Studio",
            "address": "78 Kimathi Street, Nairobi CBD",
            "contactName": "Sarah Davis",
            "contactPhone": "+254 733 556677",
            "instructions": "Deliver during business hours 9am-5pm",
            "coordinates": {
                "lat": -1.2833,
                "lng": 36.8219
            }
        },
        
        "items": [
            {
                "_id": "item_004",
                "product": "prod_009",
                "sku": "CANVAS-LG-24X36",
                "name": "Large Canvas Print 24x36",
                "description": "Gallery-wrapped canvas print",
                "category": "Canvas Prints",
                "quantity": 3,
                "unitPrice": 149.99,
                "total": 449.97,
                "verified": {
                    "scanned": true,
                    "scannedAt": new Date("2024-01-14T14:20:00Z"),
                    "scannedBy": "ST-004",
                    "photoUrl": "https://storage.example.com/verification/ord_003_item_004.jpg",
                    "notes": "All 3 canvases in perfect condition"
                },
                "reservedQuantity": 3
            }
        ],
        
        "subtotal": 449.97,
        "taxRate": 16,
        "tax": 72.00,
        "total": 521.97,
        "deposit": 521.97,
        "balance": 0,
        "payments": [
            {
                "_id": "pay_002",
                "method": PaymentMethod.CASH,
                "reference": "",
                "amount": 521.97,
                "paidAt": new Date("2024-01-14T15:00:00Z"),
                "paidBy": "Sarah Davis",
                "verifiedBy": "ST-002"
            }
        ],
        
        "status": OrderStatus.PACKED,
        "statusHistory": [
            {
                "status": OrderStatus.DRAFT,
                "changedAt": new Date("2024-01-13T09:30:00Z"),
                "changedBy": "ST-002",
                "reason": "Order created"
            },
            {
                "status": OrderStatus.CONFIRMED,
                "changedAt": new Date("2024-01-13T10:00:00Z"),
                "changedBy": "ST-002",
                "reason": "Stock verified"
            },
            {
                "status": OrderStatus.PACKING,
                "changedAt": new Date("2024-01-14T08:00:00Z"),
                "changedBy": "ST-004",
                "reason": "Packaging started"
            },
            {
                "status": OrderStatus.PACKED,
                "changedAt": new Date("2024-01-14T14:30:00Z"),
                "changedBy": "ST-004",
                "reason": "All items verified"
            }
        ],
        
        "createdBy": "ST-002",
        "assignedTo": "ST-004",
        "approvedBy": null,
        
        "orderDate": new Date("2024-01-13T09:30:00Z"),
        "requestedDeliveryDate": new Date("2024-01-15T00:00:00Z"),
        "promisedDeliveryDate": new Date("2024-01-14T00:00:00Z"),
        "actualDeliveryDate": new Date("2024-01-14T15:30:00Z"),
        
        "messages": [
            {
                "_id": "msg_004",
                "from": "ST-004",
                "fromModel": MessageFromModel.STAFF,
                "text": "Order is packed and ready for pickup/delivery.",
                "timestamp": new Date("2024-01-14T14:31:00Z"),
                "isInternal": false,
                "attachments": [
                    "https://storage.example.com/messages/packed_ord_003.jpg"
                ],
                "messageType": MessageType.DELIVERY_NOTE
            }
        ],
        
        "generatedDocuments": [
            {
                "type": "invoice",
                "documentId": "doc_003",
                "number": "INV-2024-000567",
                "createdAt": new Date("2024-01-13T10:00:00Z")
            }
        ],
        
        "version": 4,
        "isLocked": true,
        "cancellationReason": "",
        "createdAt": new Date("2024-01-13T09:30:00Z"),
        "updatedAt": new Date("2024-01-14T15:30:00Z")
    },
    {
        "_id": "ord_004",
        "orderNumber": "ORD-2024-000004",
        "client": "CL-004",
        
        "destination": {
            "deliveryPointId": "dp_004",
            "name": "Wilson Family Home",
            "address": "56 Muthaiga Road, Muthaiga, Nairobi",
            "contactName": "David Wilson",
            "contactPhone": "+254 722 998877",
            "instructions": "Call 30 minutes before arrival",
            "coordinates": {
                "lat": -1.2581,
                "lng": 36.8245
            }
        },
        
        "items": [
            {
                "_id": "item_005",
                "product": "prod_012",
                "sku": "FRAME-WOOD-11X14",
                "name": "Premium Wood Frame 11x14",
                "description": "Solid oak frame",
                "category": "Frames",
                "quantity": 5,
                "unitPrice": 59.99,
                "total": 299.95,
                "verified": {
                    "scanned": false,
                    "scannedAt": null,
                    "scannedBy": null,
                    "photoUrl": "",
                    "notes": ""
                },
                "reservedQuantity": 5
            }
        ],
        
        "subtotal": 299.95,
        "taxRate": 16,
        "tax": 47.99,
        "total": 347.94,
        "deposit": 100.00,
        "balance": 247.94,
        "payments": [
            {
                "_id": "pay_003",
                "method": PaymentMethod.BANK_TRANSFER,
                "reference": "TRF2024011702",
                "amount": 100.00,
                "paidAt": new Date("2024-01-17T09:15:00Z"),
                "paidBy": "David Wilson",
                "verifiedBy": "ST-001"
            }
        ],
        
        "status": OrderStatus.CONFIRMED,
        "statusHistory": [
            {
                "status": OrderStatus.DRAFT,
                "changedAt": new Date("2024-01-17T08:30:00Z"),
                "changedBy": "ST-001",
                "reason": "Order created"
            },
            {
                "status": OrderStatus.CONFIRMED,
                "changedAt": new Date("2024-01-17T09:30:00Z"),
                "changedBy": "ST-001",
                "reason": "Deposit received"
            }
        ],
        
        "createdBy": "ST-001",
        "assignedTo": null,
        "approvedBy": null,
        
        "orderDate": new Date("2024-01-17T08:30:00Z"),
        "requestedDeliveryDate": new Date("2024-01-25T00:00:00Z"),
        "promisedDeliveryDate": null,
        "actualDeliveryDate": null,
        
        "messages": [],
        
        "generatedDocuments": [],
        
        "version": 2,
        "isLocked": true,
        "cancellationReason": "",
        "createdAt": new Date("2024-01-17T08:30:00Z"),
        "updatedAt": new Date("2024-01-17T09:30:00Z")
    },
    {
        "_id": "ord_005",
        "orderNumber": "ORD-2024-000005",
        "client": "CL-005",
        
        "destination": {
            "deliveryPointId": "dp_005",
            "name": "Brown & Co Office",
            "address": "234 Business Park, Upper Hill, Nairobi",
            "contactName": "James Brown",
            "contactPhone": "+254 733 445566",
            "instructions": "Deliver to reception, 3rd floor",
            "coordinates": {
                "lat": -1.2981,
                "lng": 36.8193
            }
        },
        
        "items": [
            {
                "_id": "item_006",
                "product": "prod_002",
                "sku": "ALB-WED-PREMIUM",
                "name": "Premium Leather Album",
                "description": "Premium leather with 30 pages",
                "category": "Wedding Albums",
                "quantity": 2,
                "unitPrice": 399.99,
                "total": 799.98,
                "verified": {
                    "scanned": false,
                    "scannedAt": null,
                    "scannedBy": null,
                    "photoUrl": "",
                    "notes": ""
                },
                "reservedQuantity": 2
            },
            {
                "_id": "item_007",
                "product": "prod_008",
                "sku": "CANVAS-MED-16X20",
                "name": "Medium Canvas Print 16x20",
                "description": "Gallery-wrapped canvas print",
                "category": "Canvas Prints",
                "quantity": 4,
                "unitPrice": 79.99,
                "total": 319.96,
                "verified": {
                    "scanned": false,
                    "scannedAt": null,
                    "scannedBy": null,
                    "photoUrl": "",
                    "notes": ""
                },
                "reservedQuantity": 4
            }
        ],
        
        "subtotal": 1119.94,
        "taxRate": 16,
        "tax": 179.19,
        "total": 1299.13,
        "deposit": 0,
        "balance": 1299.13,
        "payments": [],
        
        "status": OrderStatus.DRAFT,
        "statusHistory": [
            {
                "status": OrderStatus.DRAFT,
                "changedAt": new Date("2024-01-18T10:00:00Z"),
                "changedBy": "ST-003",
                "reason": "Order created"
            }
        ],
        
        "createdBy": "ST-003",
        "assignedTo": null,
        "approvedBy": null,
        
        "orderDate": new Date("2024-01-18T10:00:00Z"),
        "requestedDeliveryDate": new Date("2024-02-01T00:00:00Z"),
        "promisedDeliveryDate": null,
        "actualDeliveryDate": null,
        
        "messages": [
            {
                "_id": "msg_005",
                "from": "ST-003",
                "fromModel": MessageFromModel.STAFF,
                "text": "Waiting for client approval before confirming.",
                "timestamp": new Date("2024-01-18T10:05:00Z"),
                "isInternal": true,
                "attachments": [],
                "messageType": MessageType.TEXT
            }
        ],
        
        "generatedDocuments": [],
        
        "version": 1,
        "isLocked": false,
        "cancellationReason": "",
        "createdAt": new Date("2024-01-18T10:00:00Z"),
        "updatedAt": new Date("2024-01-18T10:00:00Z")
    }
];

const dummyOrderStats = {
    date: new Date(),
    totalOrders: 5,
    byStatus: {
        [OrderStatus.DRAFT]: 1,
        [OrderStatus.CONFIRMED]: 2,
        [OrderStatus.PACKING]: 1,
        [OrderStatus.PACKED]: 1,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.COMPLETED]: 0,
        [OrderStatus.CANCELLED]: 0
    },
    revenue: {
        total: 3189.69,
        collected: 821.97,
        outstanding: 2367.72
    },
    itemsToPack: 3,
    overdueOrders: 0,
    pendingApproval: 1,
    averageOrderValue: 637.94
};

const dummyPackagingQueue = [
    {
        orderId: "ord_002",
        orderNumber: "ORD-2024-000002",
        clientName: "Smith Wedding",
        items: 1,
        requestedDate: new Date("2024-01-25T00:00:00Z"),
        priority: "medium",
        stage: "queued"
    },
    {
        orderId: "ord_001",
        orderNumber: "ORD-2024-000001",
        clientName: "Johnson Family",
        items: 2,
        requestedDate: new Date("2024-01-20T00:00:00Z"),
        priority: "high",
        stage: "processing"
    }
];

async function seedOrders() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Order.deleteMany({}),
            OrderStats.deleteMany({}),
            PackagingQueue.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Orders
        console.log('📦 Seeding orders...');
        await Order.insertMany(dummyOrders);
        console.log(`✅ ${dummyOrders.length} orders seeded`);

        // Seed Order Stats
        console.log('📊 Seeding order statistics...');
        await OrderStats.create(dummyOrderStats);
        console.log('✅ Order statistics seeded');

        // Seed Packaging Queue
        console.log('📋 Seeding packaging queue...');
        await PackagingQueue.insertMany(dummyPackagingQueue);
        console.log(`✅ ${dummyPackagingQueue.length} packaging queue items seeded`);

        // Verify counts
        const counts = await Promise.all([
            Order.countDocuments(),
            OrderStats.countDocuments(),
            PackagingQueue.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Orders: ${counts[0]}`);
        console.log(`   Order Stats: ${counts[1]}`);
        console.log(`   Packaging Queue: ${counts[2]}`);

        // Calculate and verify totals
        const orderTotals = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                    totalCollected: { $sum: { $add: ["$deposit", { $sum: "$payments.amount" }] } },
                    avgOrderValue: { $avg: "$total" }
                }
            }
        ]);

        if (orderTotals.length > 0) {
            console.log('\n💰 Financial Summary:');
            console.log(`   Total Revenue: KSh ${orderTotals[0].totalRevenue.toFixed(2)}`);
            console.log(`   Total Collected: KSh ${orderTotals[0].totalCollected.toFixed(2)}`);
            console.log(`   Average Order Value: KSh ${orderTotals[0].avgOrderValue.toFixed(2)}`);
        }

        console.log('\n✅ Orders seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding orders:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedOrders();