// scripts/seed-clients.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Client,
    ClientStats,
    AgingReceivables,
    TopClients,
    ClientType,
    ClientCategory,
    PhoneType,
    AddressType,
    CommunicationType,
    CommunicationDirection,
    PaymentMethod,
    RelatedEntityType,
    ClientTrend
} from '../models/clients.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Dummy clients data (from your existing code)
const dummyClients = [
    {
        "_id": "CL-001",
        "clientType": ClientType.BUSINESS,
        "clientNumber": "C-000001",
        
        "name": "Johnson Family Photography",
        "tradingName": "Johnson Photos",
        "contactPerson": "Michael Johnson",
        "jobTitle": "Owner",
        
        "phones": [
            {
                "_id": "phone_001",
                "phoneType": PhoneType.MOBILE,
                "number": "+254722334455",
                "isPrimary": true,
                "isVerified": true,
                "extension": "",
                "whatsappEnabled": true,
                "callConsent": true,
                "lastVerifiedAt": new Date("2024-01-10T09:00:00Z")
            },
            {
                "_id": "phone_002",
                "phoneType": PhoneType.WORK,
                "number": "+254203334455",
                "isPrimary": false,
                "isVerified": true,
                "extension": "123",
                "whatsappEnabled": false,
                "callConsent": true,
                "lastVerifiedAt": new Date("2024-01-10T09:00:00Z")
            }
        ],
        
        "emails": ["michael@johnsonphoto.com", "accounts@johnsonphoto.com"],
        
        "addresses": [
            {
                "_id": "addr_001",
                "addressType": AddressType.SHIPPING,
                "label": "Main Studio",
                "attention": "Michael Johnson",
                "street": "123 Muthaiga Road",
                "building": "Johnson Plaza",
                "floor": "2nd Floor",
                "unit": "Suite 203",
                "city": "Nairobi",
                "postalCode": "00100",
                "county": "Nairobi",
                "country": "Kenya",
                "coordinates": {
                    "lat": -1.2621,
                    "lng": 36.8123
                },
                "instructions": "Parking available at back. Use service elevator for large deliveries.",
                "isDefault": true,
                "deliveryHours": "Mon-Fri 9am-5pm, Sat 9am-12pm",
                "accessRestrictions": "Security gate - show ID",
                "active": true,
                "addedAt": new Date("2023-01-15T08:00:00Z")
            },
            {
                "_id": "addr_002",
                "addressType": AddressType.BILLING,
                "label": "Accounts Department",
                "attention": "Accounts Payable",
                "street": "123 Muthaiga Road",
                "building": "Johnson Plaza",
                "floor": "1st Floor",
                "unit": "Finance",
                "city": "Nairobi",
                "postalCode": "00100",
                "county": "Nairobi",
                "country": "Kenya",
                "instructions": "Drop invoices with reception",
                "isDefault": false,
                "active": true,
                "addedAt": new Date("2023-01-15T08:00:00Z")
            }
        ],
        
        "category": ClientCategory.WHOLESALE,
        "industry": "Photography",
        
        "paymentTerms": 30,
        "taxId": "P051234567K",
        "taxExempt": false,
        
        "orders": ["ord_001", "ord_004"],
        "documents": ["doc_001", "doc_003"],
        
        "payments": [
            {
                "_id": "pay_001",
                "amount": 10000,
                "currency": "KES",
                "date": new Date("2024-01-15T10:30:00Z"),
                "method": PaymentMethod.MPESA,
                "reference": "QK7X9P2M",
                "againstInvoice": "doc_001",
                "invoiceNumber": "INV-2024-001234",
                "recordedBy": "ST-001",
                "notes": "Initial deposit"
            },
            {
                "_id": "pay_002",
                "amount": 5000,
                "currency": "KES",
                "date": new Date("2024-01-18T09:15:00Z"),
                "method": PaymentMethod.BANK_TRANSFER,
                "reference": "TRF2024011802",
                "againstInvoice": "doc_001",
                "invoiceNumber": "INV-2024-001234",
                "recordedBy": "ST-001",
                "notes": ""
            }
        ],
        
        "communications": [
            {
                "_id": "comm_001",
                "timestamp": new Date("2024-01-15T09:00:00Z"),
                "communicationType": CommunicationType.CALL,
                "direction": CommunicationDirection.OUTBOUND,
                "summary": "Confirmed order details",
                "details": "Discussed album design options. Client happy with samples.",
                "relatedTo": RelatedEntityType.ORDER,
                "relatedId": "ord_001",
                "staff": "ST-001",
                "duration": 15,
                "outcome": "Order confirmed",
                "followUpDate": null,
                "attachments": []
            },
            {
                "_id": "comm_002",
                "timestamp": new Date("2024-01-16T14:30:00Z"),
                "communicationType": CommunicationType.WHATSAPP,
                "direction": CommunicationDirection.INBOUND,
                "summary": "When will my order be ready?",
                "details": "Client asking about delivery date",
                "relatedTo": RelatedEntityType.ORDER,
                "relatedId": "ord_001",
                "staff": "ST-004",
                "duration": null,
                "outcome": "Provided tracking info",
                "followUpDate": null,
                "attachments": []
            }
        ],
        
        "account": {
            "currency": "KES",
            "totalPurchases": 31772,
            "totalPaid": 15000,
            "balanceDue": 16772,
            "creditLimit": 50000,
            "availableCredit": 33228,
            "lastPaymentDate": new Date("2024-01-18T09:15:00Z"),
            "lastPaymentAmount": 5000,
            "averagePaymentDays": 12,
            "onTimePaymentRate": 95,
            "currentMonthPurchases": 31772,
            "currentMonthPayments": 15000,
            "oldestUnpaidInvoice": new Date("2024-01-14T09:30:00Z"),
            "daysSinceLastPayment": 2
        },
        
        "flags": {
            "isSlowPayer": false,
            "isFrequentDisputer": false,
            "frequentChanger": false,
            "highMaintenance": false,
            "preferred": true,
            "onHold": false,
            "requiresDeposit": false,
            "creditSuspended": false,
            "specialHandling": false,
            "autoApprove": true
        },
        
        "stats": {
            "totalOrders": 2,
            "totalInvoices": 2,
            "totalQuotations": 1,
            "acceptanceRate": 100,
            "averageOrderValue": 15886,
            "averageItemsPerOrder": 2.5,
            "preferredCategories": ["Wedding Albums", "Canvas Prints"],
            "firstOrderDate": new Date("2024-01-15T09:00:00Z"),
            "lastOrderDate": new Date("2024-01-18T10:00:00Z"),
            "daysSinceLastOrder": 2,
            "relationshipLengthDays": 370,
            "ordersPerMonth": 0.16,
            "trend": ClientTrend.STABLE
        },
        
        "tags": [
            {
                "_id": "tag_001",
                "tag": "VIP Client",
                "addedBy": "ST-001",
                "addedAt": new Date("2023-06-01T10:00:00Z"),
                "color": "#F59E0B"
            },
            {
                "_id": "tag_002",
                "tag": "Wedding Specialist",
                "addedBy": "ST-001",
                "addedAt": new Date("2023-06-01T10:00:00Z"),
                "color": "#3B82F6"
            }
        ],
        
        "internalNotes": "Premium client, prefers phone contact. Always pays on time.",
        "clientNotes": "Thank you for your continued business!",
        
        "referredBy": null,
        "assignedTo": "ST-001",
        "createdBy": "ST-001",
        "createdAt": new Date("2023-01-15T08:00:00Z"),
        "updatedAt": new Date("2024-01-18T10:00:00Z"),
        "lastActivityAt": new Date("2024-01-18T10:00:00Z")
    },
    {
        "_id": "CL-002",
        "clientType": ClientType.BUSINESS,
        "clientNumber": "C-000002",
        
        "name": "Smith Wedding Events",
        "tradingName": "Smith Weddings",
        "contactPerson": "Emma Smith",
        "jobTitle": "Wedding Planner",
        
        "phones": [
            {
                "_id": "phone_003",
                "phoneType": PhoneType.MOBILE,
                "number": "+254711223344",
                "isPrimary": true,
                "isVerified": true,
                "extension": "",
                "whatsappEnabled": true,
                "callConsent": true,
                "lastVerifiedAt": new Date("2024-01-05T11:00:00Z")
            }
        ],
        
        "emails": ["emma@smithweddings.co.ke"],
        
        "addresses": [
            {
                "_id": "addr_003",
                "addressType": AddressType.SHIPPING,
                "label": "Wedding Venue",
                "attention": "Emma Smith",
                "street": "45 Karen Road",
                "building": "Karen Country Lodge",
                "city": "Nairobi",
                "county": "Nairobi",
                "country": "Kenya",
                "instructions": "Deliver to event coordinator at reception",
                "isDefault": true,
                "active": true,
                "addedAt": new Date("2023-03-10T09:00:00Z")
            }
        ],
        
        "category": ClientCategory.RETAIL,
        "industry": "Events",
        
        "paymentTerms": 0,
        "taxId": "",
        "taxExempt": false,
        
        "orders": ["ord_002"],
        "documents": [],
        
        "payments": [],
        
        "communications": [
            {
                "_id": "comm_003",
                "timestamp": new Date("2024-01-16T11:30:00Z"),
                "communicationType": CommunicationType.EMAIL,
                "direction": CommunicationDirection.OUTBOUND,
                "summary": "Order confirmation sent",
                "details": "Order ORD-2024-000002 confirmed via email",
                "relatedTo": RelatedEntityType.ORDER,
                "relatedId": "ord_002",
                "staff": "ST-002",
                "duration": null,
                "outcome": "Email sent",
                "followUpDate": null,
                "attachments": ["order_confirmation_ord_002.pdf"]
            }
        ],
        
        "account": {
            "currency": "KES",
            "totalPurchases": 579.88,
            "totalPaid": 0,
            "balanceDue": 579.88,
            "creditLimit": 0,
            "availableCredit": 0,
            "lastPaymentDate": null,
            "lastPaymentAmount": null,
            "averagePaymentDays": 0,
            "onTimePaymentRate": 100,
            "currentMonthPurchases": 579.88,
            "currentMonthPayments": 0,
            "oldestUnpaidInvoice": null,
            "daysSinceLastPayment": null
        },
        
        "flags": {
            "isSlowPayer": false,
            "isFrequentDisputer": false,
            "frequentChanger": false,
            "highMaintenance": false,
            "preferred": false,
            "onHold": false,
            "requiresDeposit": true,
            "creditSuspended": false,
            "specialHandling": false,
            "autoApprove": false
        },
        
        "stats": {
            "totalOrders": 1,
            "totalInvoices": 0,
            "totalQuotations": 0,
            "acceptanceRate": 0,
            "averageOrderValue": 579.88,
            "averageItemsPerOrder": 1,
            "preferredCategories": ["Photo Books"],
            "firstOrderDate": new Date("2024-01-16T11:00:00Z"),
            "lastOrderDate": new Date("2024-01-16T11:00:00Z"),
            "daysSinceLastOrder": 4,
            "relationshipLengthDays": 315,
            "ordersPerMonth": 0.09,
            "trend": ClientTrend.STABLE
        },
        
        "tags": [],
        
        "internalNotes": "New client, requires deposit for first order.",
        "clientNotes": "",
        
        "referredBy": null,
        "assignedTo": null,
        "createdBy": "ST-002",
        "createdAt": new Date("2023-03-10T09:00:00Z"),
        "updatedAt": new Date("2024-01-16T11:00:00Z"),
        "lastActivityAt": new Date("2024-01-16T11:00:00Z")
    },
    {
        "_id": "CL-003",
        "clientType": ClientType.INDIVIDUAL,
        "clientNumber": "C-000003",
        
        "name": "Sarah Davis",
        "tradingName": "Davis Portrait Studio",
        "contactPerson": "Sarah Davis",
        "jobTitle": "Photographer",
        
        "phones": [
            {
                "_id": "phone_004",
                "phoneType": PhoneType.MOBILE,
                "number": "+254733556677",
                "isPrimary": true,
                "isVerified": true,
                "extension": "",
                "whatsappEnabled": true,
                "callConsent": true,
                "lastVerifiedAt": new Date("2023-12-01T14:00:00Z")
            }
        ],
        
        "emails": ["sarah@davisportrait.com"],
        
        "addresses": [
            {
                "_id": "addr_004",
                "addressType": AddressType.SHIPPING,
                "label": "Studio",
                "attention": "Sarah Davis",
                "street": "78 Kimathi Street",
                "building": "Ambassador House",
                "floor": "3rd Floor",
                "unit": "Studio 305",
                "city": "Nairobi",
                "postalCode": "00100",
                "county": "Nairobi",
                "country": "Kenya",
                "instructions": "Use freight elevator for large deliveries",
                "isDefault": true,
                "deliveryHours": "Mon-Fri 9am-5pm",
                "active": true,
                "addedAt": new Date("2023-05-20T10:00:00Z")
            }
        ],
        
        "category": ClientCategory.WHOLESALE,
        "industry": "Photography",
        
        "paymentTerms": 15,
        "taxId": "A005678901V",
        "taxExempt": false,
        
        "orders": ["ord_003"],
        "documents": ["doc_002"],
        
        "payments": [
            {
                "_id": "pay_003",
                "amount": 521.97,
                "currency": "KES",
                "date": new Date("2024-01-14T15:00:00Z"),
                "method": PaymentMethod.CASH,
                "reference": "",
                "againstInvoice": "doc_002",
                "invoiceNumber": "QOT-2024-000567",
                "recordedBy": "ST-002",
                "notes": "Cash sale"
            }
        ],
        
        "communications": [
            {
                "_id": "comm_004",
                "timestamp": new Date("2024-01-13T09:30:00Z"),
                "communicationType": CommunicationType.VISIT,
                "direction": CommunicationDirection.INBOUND,
                "summary": "Walk-in customer",
                "details": "Client came to studio to discuss canvas prints",
                "relatedTo": RelatedEntityType.GENERAL,
                "relatedId": null,
                "staff": "ST-002",
                "duration": 30,
                "outcome": "Placed order",
                "followUpDate": null,
                "attachments": []
            }
        ],
        
        "account": {
            "currency": "KES",
            "totalPurchases": 521.97,
            "totalPaid": 521.97,
            "balanceDue": 0,
            "creditLimit": 25000,
            "availableCredit": 25000,
            "lastPaymentDate": new Date("2024-01-14T15:00:00Z"),
            "lastPaymentAmount": 521.97,
            "averagePaymentDays": 0,
            "onTimePaymentRate": 100,
            "currentMonthPurchases": 521.97,
            "currentMonthPayments": 521.97,
            "oldestUnpaidInvoice": null,
            "daysSinceLastPayment": 6
        },
        
        "flags": {
            "isSlowPayer": false,
            "isFrequentDisputer": false,
            "frequentChanger": false,
            "highMaintenance": false,
            "preferred": false,
            "onHold": false,
            "requiresDeposit": false,
            "creditSuspended": false,
            "specialHandling": false,
            "autoApprove": false
        },
        
        "stats": {
            "totalOrders": 1,
            "totalInvoices": 0,
            "totalQuotations": 1,
            "acceptanceRate": 100,
            "averageOrderValue": 521.97,
            "averageItemsPerOrder": 1,
            "preferredCategories": ["Canvas Prints"],
            "firstOrderDate": new Date("2024-01-13T09:30:00Z"),
            "lastOrderDate": new Date("2024-01-13T09:30:00Z"),
            "daysSinceLastOrder": 7,
            "relationshipLengthDays": 250,
            "ordersPerMonth": 0.12,
            "trend": ClientTrend.GROWING
        },
        
        "tags": [],
        
        "internalNotes": "Regular walk-in client. Always pays cash.",
        "clientNotes": "",
        
        "referredBy": null,
        "assignedTo": null,
        "createdBy": "ST-002",
        "createdAt": new Date("2023-05-20T10:00:00Z"),
        "updatedAt": new Date("2024-01-14T15:00:00Z"),
        "lastActivityAt": new Date("2024-01-14T15:00:00Z")
    },
    {
        "_id": "CL-004",
        "clientType": ClientType.BUSINESS,
        "clientNumber": "C-000004",
        
        "name": "Wilson Family Photography",
        "tradingName": "Wilson Photos",
        "contactPerson": "David Wilson",
        "jobTitle": "Owner",
        
        "phones": [
            {
                "_id": "phone_005",
                "phoneType": PhoneType.MOBILE,
                "number": "+254722998877",
                "isPrimary": true,
                "isVerified": true,
                "extension": "",
                "whatsappEnabled": true,
                "callConsent": true,
                "lastVerifiedAt": new Date("2024-01-10T10:00:00Z")
            }
        ],
        
        "emails": ["david@wilsonphotos.co.ke"],
        
        "addresses": [
            {
                "_id": "addr_005",
                "addressType": AddressType.SHIPPING,
                "label": "Home Studio",
                "attention": "David Wilson",
                "street": "56 Muthaiga Road",
                "city": "Nairobi",
                "county": "Nairobi",
                "country": "Kenya",
                "instructions": "Call 30 minutes before arrival",
                "isDefault": true,
                "active": true,
                "addedAt": new Date("2023-08-01T09:00:00Z")
            }
        ],
        
        "category": ClientCategory.RETAIL,
        "industry": "Photography",
        
        "paymentTerms": 0,
        "taxId": "A009876543V",
        "taxExempt": false,
        
        "orders": ["ord_004"],
        "documents": [],
        
        "payments": [
            {
                "_id": "pay_004",
                "amount": 100,
                "currency": "KES",
                "date": new Date("2024-01-17T09:15:00Z"),
                "method": PaymentMethod.BANK_TRANSFER,
                "reference": "TRF2024011702",
                "againstInvoice": null,
                "invoiceNumber": "",
                "recordedBy": "ST-001",
                "notes": "Deposit for order"
            }
        ],
        
        "communications": [],
        
        "account": {
            "currency": "KES",
            "totalPurchases": 347.94,
            "totalPaid": 100,
            "balanceDue": 247.94,
            "creditLimit": 0,
            "availableCredit": 0,
            "lastPaymentDate": new Date("2024-01-17T09:15:00Z"),
            "lastPaymentAmount": 100,
            "averagePaymentDays": 0,
            "onTimePaymentRate": 100,
            "currentMonthPurchases": 347.94,
            "currentMonthPayments": 100,
            "oldestUnpaidInvoice": null,
            "daysSinceLastPayment": 3
        },
        
        "flags": {
            "isSlowPayer": false,
            "isFrequentDisputer": false,
            "frequentChanger": false,
            "highMaintenance": false,
            "preferred": false,
            "onHold": false,
            "requiresDeposit": false,
            "creditSuspended": false,
            "specialHandling": false,
            "autoApprove": false
        },
        
        "stats": {
            "totalOrders": 1,
            "totalInvoices": 0,
            "totalQuotations": 0,
            "acceptanceRate": 0,
            "averageOrderValue": 347.94,
            "averageItemsPerOrder": 1,
            "preferredCategories": ["Frames"],
            "firstOrderDate": new Date("2024-01-17T08:30:00Z"),
            "lastOrderDate": new Date("2024-01-17T08:30:00Z"),
            "daysSinceLastOrder": 3,
            "relationshipLengthDays": 180,
            "ordersPerMonth": 0.17,
            "trend": ClientTrend.GROWING
        },
        
        "tags": [],
        
        "internalNotes": "New client, first order.",
        "clientNotes": "",
        
        "referredBy": null,
        "assignedTo": null,
        "createdBy": "ST-001",
        "createdAt": new Date("2023-08-01T09:00:00Z"),
        "updatedAt": new Date("2024-01-17T09:30:00Z"),
        "lastActivityAt": new Date("2024-01-17T09:30:00Z")
    },
    {
        "_id": "CL-005",
        "clientType": ClientType.BUSINESS,
        "clientNumber": "C-000005",
        
        "name": "Brown & Co Corporate",
        "tradingName": "Brown Corporate",
        "contactPerson": "James Brown",
        "jobTitle": "Procurement Manager",
        
        "phones": [
            {
                "_id": "phone_006",
                "phoneType": PhoneType.WORK,
                "number": "+254203456789",
                "isPrimary": true,
                "isVerified": true,
                "extension": "456",
                "whatsappEnabled": false,
                "callConsent": true,
                "lastVerifiedAt": new Date("2024-01-05T14:00:00Z")
            },
            {
                "_id": "phone_007",
                "phoneType": PhoneType.MOBILE,
                "number": "+254733445566",
                "isPrimary": false,
                "isVerified": true,
                "extension": "",
                "whatsappEnabled": true,
                "callConsent": true,
                "lastVerifiedAt": new Date("2024-01-05T14:00:00Z")
            }
        ],
        
        "emails": ["james@brownco.co.ke", "procurement@brownco.co.ke"],
        
        "addresses": [
            {
                "_id": "addr_006",
                "addressType": AddressType.SHIPPING,
                "label": "Head Office",
                "attention": "Procurement Dept",
                "street": "234 Business Park",
                "building": "Brown Tower",
                "floor": "3rd Floor",
                "unit": "Procurement",
                "city": "Nairobi",
                "postalCode": "00100",
                "county": "Nairobi",
                "country": "Kenya",
                "instructions": "Deliver to reception, 3rd floor",
                "isDefault": true,
                "deliveryHours": "Mon-Fri 8am-5pm",
                "accessRestrictions": "Register at front desk",
                "active": true,
                "addedAt": new Date("2023-02-01T08:00:00Z")
            },
            {
                "_id": "addr_007",
                "addressType": AddressType.BILLING,
                "label": "Accounts Department",
                "attention": "Accounts Payable",
                "street": "234 Business Park",
                "building": "Brown Tower",
                "floor": "2nd Floor",
                "unit": "Finance",
                "city": "Nairobi",
                "postalCode": "00100",
                "county": "Nairobi",
                "country": "Kenya",
                "isDefault": false,
                "active": true,
                "addedAt": new Date("2023-02-01T08:00:00Z")
            },
            {
                "_id": "addr_008",
                "addressType": AddressType.WAREHOUSE,
                "label": "Warehouse",
                "attention": "Warehouse Manager",
                "street": "45 Industrial Area",
                "city": "Nairobi",
                "county": "Nairobi",
                "country": "Kenya",
                "instructions": "Loading dock at back",
                "isDefault": false,
                "deliveryHours": "Mon-Fri 8am-4pm",
                "active": true,
                "addedAt": new Date("2023-06-15T10:00:00Z")
            }
        ],
        
        "category": ClientCategory.WHOLESALE,
        "industry": "Corporate Services",
        
        "paymentTerms": 45,
        "taxId": "P056789012K",
        "taxExempt": false,
        
        "orders": ["ord_005"],
        "documents": [],
        
        "payments": [],
        
        "communications": [
            {
                "_id": "comm_005",
                "timestamp": new Date("2024-01-18T10:05:00Z"),
                "communicationType": CommunicationType.EMAIL,
                "direction": CommunicationDirection.OUTBOUND,
                "summary": "Quotation sent",
                "details": "Quotation QOT-2024-000789 sent for approval",
                "relatedTo": RelatedEntityType.ORDER,
                "relatedId": "ord_005",
                "staff": "ST-003",
                "duration": null,
                "outcome": "Awaiting approval",
                "followUpDate": new Date("2024-01-20T00:00:00Z"),
                "attachments": ["quotation_ord_005.pdf"]
            }
        ],
        
        "account": {
            "currency": "KES",
            "totalPurchases": 0,
            "totalPaid": 0,
            "balanceDue": 0,
            "creditLimit": 100000,
            "availableCredit": 100000,
            "lastPaymentDate": null,
            "lastPaymentAmount": null,
            "averagePaymentDays": 35,
            "onTimePaymentRate": 90,
            "currentMonthPurchases": 0,
            "currentMonthPayments": 0,
            "oldestUnpaidInvoice": null,
            "daysSinceLastPayment": null
        },
        
        "flags": {
            "isSlowPayer": false,
            "isFrequentDisputer": false,
            "frequentChanger": false,
            "highMaintenance": false,
            "preferred": true,
            "onHold": false,
            "requiresDeposit": false,
            "creditSuspended": false,
            "specialHandling": false,
            "autoApprove": true
        },
        
        "stats": {
            "totalOrders": 0,
            "totalInvoices": 0,
            "totalQuotations": 1,
            "acceptanceRate": 0,
            "averageOrderValue": 0,
            "averageItemsPerOrder": 0,
            "preferredCategories": [],
            "firstOrderDate": null,
            "lastOrderDate": null,
            "daysSinceLastOrder": null,
            "relationshipLengthDays": 350,
            "ordersPerMonth": 0,
            "trend": ClientTrend.INACTIVE
        },
        
        "tags": [
            {
                "_id": "tag_003",
                "tag": "Corporate Account",
                "addedBy": "ST-003",
                "addedAt": new Date("2023-02-01T08:00:00Z"),
                "color": "#3B82F6"
            },
            {
                "_id": "tag_004",
                "tag": "Net 45",
                "addedBy": "ST-003",
                "addedAt": new Date("2023-02-01T08:00:00Z"),
                "color": "#10B981"
            }
        ],
        
        "internalNotes": "Corporate client, monthly orders expected. Net 45 terms.",
        "clientNotes": "Welcome to our corporate program!",
        
        "referredBy": null,
        "assignedTo": "ST-003",
        "createdBy": "ST-003",
        "createdAt": new Date("2023-02-01T08:00:00Z"),
        "updatedAt": new Date("2024-01-18T10:00:00Z"),
        "lastActivityAt": new Date("2024-01-18T10:00:00Z")
    }
];

const dummyClientStats = {
    date: new Date(),
    totalClients: 5,
    byCategory: {
        [ClientCategory.RETAIL]: 2,
        [ClientCategory.WHOLESALE]: 3,
        [ClientCategory.SPECIAL]: 0,
        [ClientCategory.EMPLOYEE]: 0,
        [ClientCategory.VIP]: 0
    },
    byType: {
        [ClientType.INDIVIDUAL]: 1,
        [ClientType.BUSINESS]: 4,
        [ClientType.GOVERNMENT]: 0,
        [ClientType.NGO]: 0
    },
    financial: {
        totalReceivables: 17620.59,
        totalPaid: 17621.97,
        averageBalance: 3524.12
    },
    riskMetrics: {
        slowPayers: 0,
        onHold: 0,
        creditSuspended: 0,
        preferred: 2
    },
    activity: {
        activeLast30Days: 4,
        newThisMonth: 1,
        inactive: 1
    },
    topCategories: [
        { category: "Photography", count: 3 },
        { category: "Events", count: 1 },
        { category: "Corporate", count: 1 }
    ]
};

const dummyAgingReceivables = [
    {
        clientId: "CL-001",
        clientName: "Johnson Family Photography",
        current: 0,
        days30: 16772,
        days60: 0,
        days90: 0,
        total: 16772
    },
    {
        clientId: "CL-002",
        clientName: "Smith Wedding Events",
        current: 579.88,
        days30: 0,
        days60: 0,
        days90: 0,
        total: 579.88
    },
    {
        clientId: "CL-004",
        clientName: "Wilson Family Photography",
        current: 247.94,
        days30: 0,
        days60: 0,
        days90: 0,
        total: 247.94
    }
];

const dummyTopClients = [
    {
        clientId: "CL-001",
        clientName: "Johnson Family Photography",
        revenue: 31772,
        orderCount: 2,
        period: "month",
        date: new Date()
    },
    {
        clientId: "CL-003",
        clientName: "Sarah Davis",
        revenue: 521.97,
        orderCount: 1,
        period: "month",
        date: new Date()
    },
    {
        clientId: "CL-002",
        clientName: "Smith Wedding Events",
        revenue: 579.88,
        orderCount: 1,
        period: "month",
        date: new Date()
    },
    {
        clientId: "CL-004",
        clientName: "Wilson Family Photography",
        revenue: 347.94,
        orderCount: 1,
        period: "month",
        date: new Date()
    }
];

async function seedClients() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Client.deleteMany({}),
            ClientStats.deleteMany({}),
            AgingReceivables.deleteMany({}),
            TopClients.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Clients
        console.log('👥 Seeding clients...');
        await Client.insertMany(dummyClients);
        console.log(`✅ ${dummyClients.length} clients seeded`);

        // Seed Client Stats
        console.log('📊 Seeding client statistics...');
        await ClientStats.create(dummyClientStats);
        console.log('✅ Client statistics seeded');

        // Seed Aging Receivables
        console.log('💰 Seeding aging receivables...');
        await AgingReceivables.insertMany(dummyAgingReceivables);
        console.log(`✅ ${dummyAgingReceivables.length} aging receivables seeded`);

        // Seed Top Clients
        console.log('🏆 Seeding top clients...');
        await TopClients.insertMany(dummyTopClients);
        console.log(`✅ ${dummyTopClients.length} top clients seeded`);

        // Verify counts
        const counts = await Promise.all([
            Client.countDocuments(),
            ClientStats.countDocuments(),
            AgingReceivables.countDocuments(),
            TopClients.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Clients: ${counts[0]}`);
        console.log(`   Client Stats: ${counts[1]}`);
        console.log(`   Aging Receivables: ${counts[2]}`);
        console.log(`   Top Clients: ${counts[3]}`);

        // Calculate and verify totals
        const clientTotals = await Client.aggregate([
            {
                $group: {
                    _id: null,
                    totalReceivables: { $sum: "$account.balanceDue" },
                    totalPurchases: { $sum: "$account.totalPurchases" },
                    totalPaid: { $sum: "$account.totalPaid" },
                    avgCreditLimit: { $avg: "$account.creditLimit" }
                }
            }
        ]);

        if (clientTotals.length > 0) {
            console.log('\n💰 Financial Summary:');
            console.log(`   Total Receivables: KSh ${clientTotals[0].totalReceivables.toFixed(2)}`);
            console.log(`   Total Purchases: KSh ${clientTotals[0].totalPurchases.toFixed(2)}`);
            console.log(`   Total Paid: KSh ${clientTotals[0].totalPaid.toFixed(2)}`);
            console.log(`   Average Credit Limit: KSh ${clientTotals[0].avgCreditLimit.toFixed(2)}`);
        }

        // Category breakdown
        const categoryBreakdown = await Client.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (categoryBreakdown.length > 0) {
            console.log('\n📈 Category Breakdown:');
            categoryBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} client(s)`);
            });
        }

        console.log('\n✅ Clients seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding clients:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedClients();