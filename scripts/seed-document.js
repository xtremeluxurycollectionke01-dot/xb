// scripts/seed-documents.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Document,
    DocumentStats,
    AgingReceivables,
    DocumentType,
    DocumentStatus,
    PaymentMethod
} from '../models/document.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Dummy documents data
const dummyDocuments = [
    {
        "_id": "doc_001",
        "documentType": DocumentType.INVOICE,
        "documentNumber": "INV-2024-001234",
        "order": "ord_001",
        
        "issuer": {
            "businessName": "LinkChem Laboratories",
            "tradingName": "LinkChem",
            "address": "123 Industrial Area",
            "postalCode": "00100",
            "city": "Nairobi",
            "country": "Kenya",
            "taxId": "P051234567K",
            "taxRate": 16,
            "phone": "+254 700 123456",
            "email": "billing@linkchem.co.ke",
            "bankDetails": {
                "bankName": "Equity Bank",
                "accountName": "LinkChem Ltd",
                "accountNumber": "1234567890",
                "branchCode": "12",
                "swiftCode": "EQBLKENA"
            },
            "mpesaPaybill": {
                "businessNumber": "123456",
                "accountNumber": "INV{number}"
            },
            "logoUrl": "/assets/logo.png"
        },
        
        "client": {
            "clientId": "CL-001",
            "name": "Johnson Family Photography",
            "contactPerson": "Michael Johnson",
            "address": "123 Main St, Westlands",
            "postalCode": "00100",
            "city": "Nairobi",
            "phone": "+254 722 334455",
            "email": "michael@johnsonphoto.com",
            "taxId": "A009876543V",
            "category": "wholesale"
        },
        
        "items": [
            {
                "lineNumber": 1,
                "sku": "ALB-WED-001",
                "name": "Premium Wedding Album",
                "description": "Leather-bound, 40 pages",
                "category": "Albums",
                "quantity": 2,
                "unit": "pcs",
                "unitPrice": 12500,
                "discountPercent": 10,
                "discountAmount": 2500,
                "total": 22500
            },
            {
                "lineNumber": 2,
                "sku": "PRT-8X10-001",
                "name": "Premium Prints 8x10",
                "description": "Matte finish",
                "category": "Prints",
                "quantity": 20,
                "unit": "pcs",
                "unitPrice": 450,
                "discountPercent": 0,
                "discountAmount": 0,
                "total": 9000
            }
        ],
        
        "currency": "KES",
        "subtotal": 31500,
        "taxRate": 16,
        "taxAmount": 5040,
        "shippingAmount": 500,
        "total": 37040,
        "amountPaid": 15000,
        "balanceDue": 22040,
        "payments": [
            {
                "_id": "pay_001",
                "amount": 10000,
                "method": PaymentMethod.MPESA,
                "reference": "QK7X9P2M",
                "receivedBy": "ST-001",
                "receivedAt": new Date("2024-01-15T10:30:00Z"),
                "notes": "Initial deposit",
                "isReconciled": true,
                "reconciledAt": new Date("2024-01-15T14:20:00Z"),
                "reconciledBy": "ST-005"
            },
            {
                "_id": "pay_002",
                "amount": 5000,
                "method": PaymentMethod.BANK_TRANSFER,
                "reference": "TRF2024011502",
                "receivedBy": "ST-001",
                "receivedAt": new Date("2024-01-18T09:15:00Z"),
                "notes": "",
                "isReconciled": false,
                "reconciledAt": null,
                "reconciledBy": null
            }
        ],
        "lastPaymentDate": new Date("2024-01-18T09:15:00Z"),
        
        "status": DocumentStatus.PARTIAL,
        "statusHistory": [
            {
                "status": DocumentStatus.DRAFT,
                "changedAt": new Date("2024-01-14T08:00:00Z"),
                "changedBy": "ST-001",
                "notes": "Created from order ORD-001"
            },
            {
                "status": DocumentStatus.ISSUED,
                "changedAt": new Date("2024-01-14T09:30:00Z"),
                "changedBy": "ST-001",
                "notes": "Document issued to client"
            },
            {
                "status": DocumentStatus.PARTIAL,
                "changedAt": new Date("2024-01-15T10:30:00Z"),
                "changedBy": "ST-001",
                "notes": "Payment received: 10000. Balance: 27040"
            },
            {
                "status": DocumentStatus.PARTIAL,
                "changedAt": new Date("2024-01-18T09:15:00Z"),
                "changedBy": "ST-001",
                "notes": "Payment received: 5000. Balance: 22040"
            }
        ],
        
        "issueDate": new Date("2024-01-14T09:30:00Z"),
        "dueDate": new Date("2024-02-13T23:59:59Z"),
        
        "isLocked": true,
        "lockedAt": new Date("2024-01-14T09:30:00Z"),
        "lockedBy": "ST-001",
        
        "voidInfo": {
            "isVoided": false,
            "voidedAt": null,
            "voidedBy": null,
            "reason": null,
            "replacementDocument": null,
            "originalDocument": null
        },
        
        "delivery": {
            "address": "123 Main St, Westlands, Nairobi",
            "contactName": "Michael Johnson",
            "contactPhone": "+254 722 334455",
            "instructions": "Call before delivery, office hours 9am-5pm",
            "estimatedDate": new Date("2024-01-20T00:00:00Z"),
            "actualDate": null,
            "deliveredBy": null,
            "deliveryNotes": null,
            "proofOfDelivery": null
        },
        
        "createdBy": "ST-001",
        "createdAt": new Date("2024-01-14T08:00:00Z"),
        "updatedAt": new Date("2024-01-18T09:15:00Z"),
        "issuedBy": "ST-001",
        "printedAt": new Date("2024-01-14T10:00:00Z"),
        "emailedAt": new Date("2024-01-14T11:30:00Z"),
        "emailCount": 2,
        
        "termsAndConditions": "Payment due within 30 days. Interest of 2% per month on overdue amounts.",
        "internalNotes": "VIP client, follow up personally",
        "clientNotes": "Thank you for your business!"
    },
    {
        "_id": "doc_002",
        "documentType": DocumentType.QUOTATION,
        "documentNumber": "QOT-2024-000567",
        "order": null,
        
        "issuer": {
            "businessName": "LinkChem Laboratories",
            "tradingName": "LinkChem",
            "address": "123 Industrial Area",
            "postalCode": "00100",
            "city": "Nairobi",
            "country": "Kenya",
            "taxId": "P051234567K",
            "taxRate": 16,
            "phone": "+254 700 123456",
            "email": "sales@linkchem.co.ke",
            "bankDetails": {
                "bankName": "Equity Bank",
                "accountName": "LinkChem Ltd",
                "accountNumber": "1234567890",
                "branchCode": "12",
                "swiftCode": "EQBLKENA"
            },
            "mpesaPaybill": {
                "businessNumber": "123456",
                "accountNumber": "QOT{number}"
            },
            "logoUrl": "/assets/logo.png"
        },
        
        "client": {
            "clientId": "CL-003",
            "name": "Davis Portrait Studio",
            "contactPerson": "Sarah Davis",
            "address": "45 Kimathi Street",
            "postalCode": "00100",
            "city": "Nairobi",
            "phone": "+254 733 556677",
            "email": "sarah@davisportrait.com",
            "taxId": "A005678901V",
            "category": "retail"
        },
        
        "items": [
            {
                "lineNumber": 1,
                "sku": "CAN-24X36-001",
                "name": "Large Canvas Print",
                "description": "24x36 gallery wrap",
                "category": "Canvas",
                "quantity": 3,
                "unit": "pcs",
                "unitPrice": 8900,
                "discountPercent": 5,
                "discountAmount": 1335,
                "total": 25365
            }
        ],
        
        "currency": "KES",
        "subtotal": 26700,
        "taxRate": 16,
        "taxAmount": 4272,
        "shippingAmount": 800,
        "total": 31772,
        "amountPaid": 0,
        "balanceDue": 31772,
        "payments": [],
        "lastPaymentDate": null,
        
        "status": DocumentStatus.ISSUED,
        "statusHistory": [
            {
                "status": DocumentStatus.DRAFT,
                "changedAt": new Date("2024-01-16T11:00:00Z"),
                "changedBy": "ST-002",
                "notes": "Created for client inquiry"
            },
            {
                "status": DocumentStatus.ISSUED,
                "changedAt": new Date("2024-01-16T14:30:00Z"),
                "changedBy": "ST-002",
                "notes": "Quotation sent to client"
            }
        ],
        
        "issueDate": new Date("2024-01-16T14:30:00Z"),
        "expiryDate": new Date("2024-02-15T23:59:59Z"),
        
        "isLocked": true,
        "lockedAt": new Date("2024-01-16T14:30:00Z"),
        "lockedBy": "ST-002",
        
        "voidInfo": {
            "isVoided": false,
            "voidedAt": null,
            "voidedBy": null,
            "reason": null,
            "replacementDocument": null,
            "originalDocument": null
        },
        
        "delivery": null,
        
        "createdBy": "ST-002",
        "createdAt": new Date("2024-01-16T11:00:00Z"),
        "updatedAt": new Date("2024-01-16T14:30:00Z"),
        "issuedBy": "ST-002",
        "printedAt": null,
        "emailedAt": new Date("2024-01-16T14:35:00Z"),
        "emailCount": 1,
        
        "termsAndConditions": "Quotation valid for 30 days. 50% deposit required to confirm order.",
        "internalNotes": "Potential large client, follow up in 2 weeks",
        "clientNotes": "Special pricing for first order"
    },
    {
        "_id": "doc_003",
        "documentType": DocumentType.CASH_SALE,
        "documentNumber": "CS-2024-000123",
        "order": null,
        
        "issuer": {
            "businessName": "LinkChem Laboratories",
            "tradingName": "LinkChem",
            "address": "123 Industrial Area",
            "postalCode": "00100",
            "city": "Nairobi",
            "country": "Kenya",
            "taxId": "P051234567K",
            "taxRate": 16,
            "phone": "+254 700 123456",
            "email": "sales@linkchem.co.ke",
            "bankDetails": null,
            "mpesaPaybill": {
                "businessNumber": "123456",
                "accountNumber": "CS{number}"
            },
            "logoUrl": "/assets/logo.png"
        },
        
        "client": {
            "clientId": "CL-002",
            "name": "Smith Wedding",
            "contactPerson": "Emma Smith",
            "address": "78 Muthaiga Road",
            "postalCode": "00100",
            "city": "Nairobi",
            "phone": "+254 711 223344",
            "email": "emma@smithwedding.com",
            "taxId": "",
            "category": "retail"
        },
        
        "items": [
            {
                "lineNumber": 1,
                "sku": "PRT-5X7-002",
                "name": "Standard Prints 5x7",
                "description": "Glossy",
                "category": "Prints",
                "quantity": 50,
                "unit": "pcs",
                "unitPrice": 150,
                "discountPercent": 0,
                "discountAmount": 0,
                "total": 7500
            },
            {
                "lineNumber": 2,
                "sku": "FRM-8X10-001",
                "name": "Basic Frames 8x10",
                "description": "Black",
                "category": "Frames",
                "quantity": 10,
                "unit": "pcs",
                "unitPrice": 450,
                "discountPercent": 0,
                "discountAmount": 0,
                "total": 4500
            }
        ],
        
        "currency": "KES",
        "subtotal": 12000,
        "taxRate": 16,
        "taxAmount": 1920,
        "shippingAmount": 0,
        "total": 13920,
        "amountPaid": 13920,
        "balanceDue": 0,
        "payments": [
            {
                "_id": "pay_003",
                "amount": 13920,
                "method": PaymentMethod.CASH,
                "reference": "",
                "receivedBy": "ST-004",
                "receivedAt": new Date("2024-01-17T16:45:00Z"),
                "notes": "Walk-in customer",
                "isReconciled": true,
                "reconciledAt": new Date("2024-01-17T17:30:00Z"),
                "reconciledBy": "ST-005"
            }
        ],
        "lastPaymentDate": new Date("2024-01-17T16:45:00Z"),
        
        "status": DocumentStatus.PAID,
        "statusHistory": [
            {
                "status": DocumentStatus.DRAFT,
                "changedAt": new Date("2024-01-17T16:30:00Z"),
                "changedBy": "ST-004",
                "notes": "Created for walk-in customer"
            },
            {
                "status": DocumentStatus.PAID,
                "changedAt": new Date("2024-01-17T16:45:00Z"),
                "changedBy": "ST-004",
                "notes": "Cash sale completed"
            }
        ],
        
        "issueDate": new Date("2024-01-17T16:45:00Z"),
        "dueDate": null,
        
        "isLocked": true,
        "lockedAt": new Date("2024-01-17T16:45:00Z"),
        "lockedBy": "ST-004",
        
        "voidInfo": {
            "isVoided": false,
            "voidedAt": null,
            "voidedBy": null,
            "reason": null,
            "replacementDocument": null,
            "originalDocument": null
        },
        
        "delivery": {
            "address": "78 Muthaiga Road, Nairobi",
            "contactName": "Emma Smith",
            "contactPhone": "+254 711 223344",
            "instructions": "Client will pick up",
            "estimatedDate": null,
            "actualDate": new Date("2024-01-17T16:45:00Z"),
            "deliveredBy": "ST-004",
            "deliveryNotes": "Handed to client in person",
            "proofOfDelivery": "/uploads/signature_cs123.jpg"
        },
        
        "createdBy": "ST-004",
        "createdAt": new Date("2024-01-17T16:30:00Z"),
        "updatedAt": new Date("2024-01-17T16:45:00Z"),
        "issuedBy": "ST-004",
        "printedAt": new Date("2024-01-17T16:50:00Z"),
        "emailedAt": null,
        "emailCount": 0,
        
        "termsAndConditions": "No refunds on cash sales. Exchange within 7 days.",
        "internalNotes": "",
        "clientNotes": "Thank you!"
    }
];

// Document stats
const documentStats = {
    date: new Date(),
    totalDocuments: 156,
    byType: {
        [DocumentType.INVOICE]: 89,
        [DocumentType.QUOTATION]: 42,
        [DocumentType.CASH_SALE]: 25
    },
    byStatus: {
        [DocumentStatus.DRAFT]: 12,
        [DocumentStatus.ISSUED]: 34,
        [DocumentStatus.PAID]: 78,
        [DocumentStatus.PARTIAL]: 15,
        [DocumentStatus.OVERDUE]: 8,
        [DocumentStatus.EXPIRED]: 5,
        [DocumentStatus.CANCELLED]: 4
    },
    monthlyTotals: {
        currentMonth: 345000,
        previousMonth: 298000,
        growth: 15.8
    },
    agingReport: [
        { bucket: "0-30 days", total: 125000, count: 28 },
        { bucket: "31-60 days", total: 68000, count: 12 },
        { bucket: "61-90 days", total: 32000, count: 5 },
        { bucket: "90+ days", total: 15000, count: 3 }
    ]
};

// Aging receivables
const agingReceivables = [
    {
        bucket: "0-30 days",
        total: 125000,
        count: 28,
        documents: dummyDocuments.filter(d => 
            d.documentType === DocumentType.INVOICE && 
            d.status !== DocumentStatus.PAID
        ).slice(0, 5).map(d => d._id)
    },
    {
        bucket: "31-60 days",
        total: 68000,
        count: 12,
        documents: []
    },
    {
        bucket: "61-90 days",
        total: 32000,
        count: 5,
        documents: []
    },
    {
        bucket: "90+ days",
        total: 15000,
        count: 3,
        documents: []
    }
];

async function seedDocuments() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Document.deleteMany({}),
            DocumentStats.deleteMany({}),
            AgingReceivables.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Documents
        console.log('📄 Seeding documents...');
        await Document.insertMany(dummyDocuments);
        console.log(`✅ ${dummyDocuments.length} documents seeded`);

        // Seed Document Stats
        console.log('📊 Seeding document statistics...');
        await DocumentStats.create(documentStats);
        console.log('✅ Document statistics seeded');

        // Seed Aging Receivables
        console.log('⏳ Seeding aging receivables...');
        await AgingReceivables.insertMany(agingReceivables);
        console.log(`✅ ${agingReceivables.length} aging receivable buckets seeded`);

        // Verify counts
        const counts = await Promise.all([
            Document.countDocuments(),
            DocumentStats.countDocuments(),
            AgingReceivables.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Documents: ${counts[0]}`);
        console.log(`   Document Stats: ${counts[1]}`);
        console.log(`   Aging Receivables: ${counts[2]}`);

        // Type breakdown
        const typeBreakdown = await Document.aggregate([
            {
                $group: {
                    _id: "$documentType",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$total" },
                    avgValue: { $avg: "$total" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (typeBreakdown.length > 0) {
            console.log('\n📈 Document Type Breakdown:');
            typeBreakdown.forEach(type => {
                console.log(`   ${type._id}: ${type.count} docs, Total: KSh ${type.totalValue.toFixed(2)}`);
            });
        }

        // Status breakdown
        const statusBreakdown = await Document.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$total" },
                    totalPaid: { $sum: "$amountPaid" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (statusBreakdown.length > 0) {
            console.log('\n📊 Status Breakdown:');
            statusBreakdown.forEach(status => {
                console.log(`   ${status._id}: ${status.count} docs, Value: KSh ${status.totalValue.toFixed(2)}`);
            });
        }

        // Financial summary
        const financialSummary = await Document.aggregate([
            {
                $group: {
                    _id: null,
                    totalIssued: { $sum: "$total" },
                    totalPaid: { $sum: "$amountPaid" },
                    totalOutstanding: { $sum: "$balanceDue" },
                    avgDocumentValue: { $avg: "$total" }
                }
            }
        ]);

        if (financialSummary.length > 0) {
            console.log('\n💰 Financial Summary:');
            console.log(`   Total Issued: KSh ${financialSummary[0].totalIssued.toFixed(2)}`);
            console.log(`   Total Paid: KSh ${financialSummary[0].totalPaid.toFixed(2)}`);
            console.log(`   Total Outstanding: KSh ${financialSummary[0].totalOutstanding.toFixed(2)}`);
            console.log(`   Average Document Value: KSh ${financialSummary[0].avgDocumentValue.toFixed(2)}`);
        }

        console.log('\n✅ Documents seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding documents:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedDocuments();