// scripts/seed-messages.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Message,
    MessageThread,
    MessageStats,
    MessageTemplate,
    QuickResponse,
    ThreadType,
    ParticipantType,
    RelatedEntityType,
    MessagePriority,
    AttachmentType,
    SendChannel,
    MessageStatus,
    BodyType
} from '../models/message.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Helper to create participants
const createClientParticipant = (id, name, phone, email) => ({
    participantType: ParticipantType.CLIENT,
    participantId: id,
    name,
    phone,
    email,
    avatar: '',
    readAt: null,
    deliveredAt: null,
    isActive: true,
    joinedAt: new Date("2024-01-15T09:00:00Z"),
    leftAt: null
});

const createStaffParticipant = (id, name) => ({
    participantType: ParticipantType.STAFF,
    participantId: id,
    name,
    phone: '',
    email: '',
    avatar: '',
    readAt: null,
    deliveredAt: null,
    isActive: true,
    joinedAt: new Date("2024-01-15T09:00:00Z"),
    leftAt: null
});

// Create participants
const client1Participant = createClientParticipant('CL-001', 'Johnson Family', '+254722334455', 'johnson@email.com');
const client2Participant = createClientParticipant('CL-002', 'Smith Wedding', '+254711223344', 'smith@email.com');
const client3Participant = createClientParticipant('CL-003', 'Davis Portrait', '+254733556677', 'davis@email.com');
const client4Participant = createClientParticipant('CL-004', 'Wilson Family', '+254722998877', 'wilson@email.com');
const client5Participant = createClientParticipant('CL-005', 'Brown & Co', '+254733445566', 'brown@email.com');

const jackyParticipant = createStaffParticipant('ST-001', 'Jacky Chen');
const gilbertParticipant = createStaffParticipant('ST-002', 'Gilbert Mwangi');
const georgeParticipant = createStaffParticipant('ST-003', 'George Odhiambo');
const sarahParticipant = createStaffParticipant('ST-004', 'Sarah Johnson');

// Message Threads
const messageThreads = [
    {
        _id: 'thread_001',
        threadType: ThreadType.CLIENT,
        subject: 'Wedding Album Order #ORD-001',
        participants: [client1Participant, jackyParticipant],
        businessContext: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_001',
            relatedNumber: 'ORD-2024-000001',
            priority: MessagePriority.NORMAL,
            requiresAction: true,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: ['wedding', 'urgent']
        },
        lastMessageAt: new Date("2024-01-15T14:30:00Z"),
        lastMessagePreview: 'When will my order be ready?',
        messageCount: 3,
        unreadCount: 2,
        isPinned: false,
        isArchived: false,
        createdAt: new Date("2024-01-15T09:00:00Z"),
        updatedAt: new Date("2024-01-15T14:30:00Z")
    },
    {
        _id: 'thread_002',
        threadType: ThreadType.CLIENT,
        subject: 'Additional Prints for Wedding',
        participants: [client2Participant, sarahParticipant],
        businessContext: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_002',
            relatedNumber: 'ORD-2024-000002',
            priority: MessagePriority.NORMAL,
            requiresAction: true,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        lastMessageAt: new Date("2024-01-15T09:45:00Z"),
        lastMessagePreview: 'Can we add 10 more prints?',
        messageCount: 1,
        unreadCount: 1,
        isPinned: false,
        isArchived: false,
        createdAt: new Date("2024-01-15T09:45:00Z"),
        updatedAt: new Date("2024-01-15T09:45:00Z")
    },
    {
        _id: 'thread_003',
        threadType: ThreadType.CLIENT,
        subject: 'Color Proof - Portrait Session',
        participants: [client3Participant, gilbertParticipant],
        businessContext: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_003',
            relatedNumber: 'ORD-2024-000003',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        lastMessageAt: new Date("2024-01-14T16:20:00Z"),
        lastMessagePreview: 'The colors look perfect!',
        messageCount: 2,
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        createdAt: new Date("2024-01-14T14:00:00Z"),
        updatedAt: new Date("2024-01-14T16:20:00Z")
    },
    {
        _id: 'thread_004',
        threadType: ThreadType.CLIENT,
        subject: 'Rush Service Request',
        participants: [client4Participant, georgeParticipant],
        businessContext: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_004',
            relatedNumber: 'ORD-2024-000004',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        lastMessageAt: new Date("2024-01-14T13:25:00Z"),
        lastMessagePreview: 'Yes, we do! There\'s an additional 50% fee for rush orders.',
        messageCount: 2,
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        createdAt: new Date("2024-01-14T11:10:00Z"),
        updatedAt: new Date("2024-01-14T13:25:00Z")
    },
    {
        _id: 'thread_005',
        threadType: ThreadType.CLIENT,
        subject: 'Billing Address Update',
        participants: [client5Participant, jackyParticipant],
        businessContext: {
            relatedTo: RelatedEntityType.CLIENT,
            relatedId: 'CL-005',
            relatedNumber: 'C-000005',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        lastMessageAt: new Date("2024-01-13T16:30:00Z"),
        lastMessagePreview: 'Updated! Your invoice will reflect the new address.',
        messageCount: 2,
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        createdAt: new Date("2024-01-13T15:50:00Z"),
        updatedAt: new Date("2024-01-13T16:30:00Z")
    },
    {
        _id: 'thread_006',
        threadType: ThreadType.INTERNAL,
        subject: 'Stock Issue - Order #ORD-002',
        participants: [jackyParticipant, gilbertParticipant, sarahParticipant],
        businessContext: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_002',
            relatedNumber: 'ORD-2024-000002',
            priority: MessagePriority.HIGH,
            requiresAction: true,
            actionBy: new Date("2024-01-16T09:00:00Z"),
            assignedTo: 'ST-002',
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        lastMessageAt: new Date("2024-01-15T10:30:00Z"),
        lastMessagePreview: 'Found alternative supplier for the prints',
        messageCount: 4,
        unreadCount: 2,
        isPinned: true,
        isArchived: false,
        createdAt: new Date("2024-01-15T09:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z")
    }
];

// Messages
const messages = [
    {
        _id: 'msg_001',
        thread: 'thread_001',
        replyTo: null,
        replyCount: 0,
        from: {
            type: ParticipantType.CLIENT,
            id: 'CL-001',
            name: 'Johnson Family',
            phone: '+254722334455',
            email: 'johnson@email.com',
            avatar: ''
        },
        to: [jackyParticipant],
        subject: '',
        body: 'Hi, I was wondering when my wedding album will be ready?',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_001',
            relatedNumber: 'ORD-2024-000001',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: 'wa_123456',
            whatsappPhoneNumber: '+254722334455',
            emailMessageId: '',
            emailThreadId: '',
            smsMessageId: '',
            sentVia: SendChannel.WHATSAPP_API,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.READ,
        sentAt: new Date("2024-01-15T10:15:00Z"),
        deliveredAt: new Date("2024-01-15T10:15:05Z"),
        readAt: new Date("2024-01-15T10:16:00Z"),
        readBy: ['ST-001'],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-15T10:15:00Z"),
        updatedAt: new Date("2024-01-15T10:16:00Z"),
        createdBy: 'CL-001',
        ipAddress: ''
    },
    {
        _id: 'msg_002',
        thread: 'thread_001',
        replyTo: 'msg_001',
        replyCount: 0,
        from: {
            type: ParticipantType.STAFF,
            id: 'ST-001',
            name: 'Jacky Chen',
            phone: '',
            email: '',
            avatar: ''
        },
        to: [client1Participant],
        subject: '',
        body: 'Good morning! Your album is in quality check and should be ready by Friday.',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_001',
            relatedNumber: 'ORD-2024-000001',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: 'wa_123457',
            whatsappPhoneNumber: '',
            emailMessageId: '',
            emailThreadId: '',
            smsMessageId: '',
            sentVia: SendChannel.WHATSAPP_API,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.DELIVERED,
        sentAt: new Date("2024-01-15T11:30:00Z"),
        deliveredAt: new Date("2024-01-15T11:30:10Z"),
        readAt: null,
        readBy: [],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-15T11:30:00Z"),
        updatedAt: new Date("2024-01-15T11:30:10Z"),
        createdBy: 'ST-001',
        ipAddress: ''
    },
    {
        _id: 'msg_003',
        thread: 'thread_001',
        replyTo: 'msg_002',
        replyCount: 0,
        from: {
            type: ParticipantType.CLIENT,
            id: 'CL-001',
            name: 'Johnson Family',
            phone: '+254722334455',
            email: '',
            avatar: ''
        },
        to: [jackyParticipant],
        subject: '',
        body: 'Great, thank you! Will you notify me when it ships?',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_001',
            relatedNumber: 'ORD-2024-000001',
            priority: MessagePriority.NORMAL,
            requiresAction: true,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: 'wa_123458',
            whatsappPhoneNumber: '+254722334455',
            emailMessageId: '',
            emailThreadId: '',
            smsMessageId: '',
            sentVia: SendChannel.WHATSAPP_API,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.SENT,
        sentAt: new Date("2024-01-15T14:30:00Z"),
        deliveredAt: null,
        readAt: null,
        readBy: [],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-15T14:30:00Z"),
        updatedAt: new Date("2024-01-15T14:30:00Z"),
        createdBy: 'CL-001',
        ipAddress: ''
    },
    {
        _id: 'msg_004',
        thread: 'thread_002',
        replyTo: null,
        replyCount: 0,
        from: {
            type: ParticipantType.CLIENT,
            id: 'CL-002',
            name: 'Smith Wedding',
            phone: '+254711223344',
            email: 'smith@email.com',
            avatar: ''
        },
        to: [sarahParticipant],
        subject: '',
        body: 'Can we add 10 more 5x7 prints to our order?',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_002',
            relatedNumber: 'ORD-2024-000002',
            priority: MessagePriority.NORMAL,
            requiresAction: true,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: '',
            whatsappPhoneNumber: '',
            emailMessageId: 'em_123456',
            emailThreadId: 'thread_abc',
            smsMessageId: '',
            sentVia: SendChannel.EMAIL,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.DELIVERED,
        sentAt: new Date("2024-01-15T09:45:00Z"),
        deliveredAt: new Date("2024-01-15T09:45:05Z"),
        readAt: null,
        readBy: [],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-15T09:45:00Z"),
        updatedAt: new Date("2024-01-15T09:45:05Z"),
        createdBy: 'CL-002',
        ipAddress: ''
    },
    {
        _id: 'msg_005',
        thread: 'thread_003',
        replyTo: null,
        replyCount: 1,
        from: {
            type: ParticipantType.STAFF,
            id: 'ST-002',
            name: 'Gilbert Mwangi',
            phone: '',
            email: '',
            avatar: ''
        },
        to: [client3Participant],
        subject: 'Color Proof for Your Portrait Session',
        body: 'Here\'s the color proof for your portrait session.',
        bodyType: BodyType.TEXT,
        attachments: [{
            _id: 'att_001',
            attachmentType: AttachmentType.IMAGE,
            url: 'https://storage.example.com/proofs/portrait_001.jpg',
            thumbnailUrl: 'https://storage.example.com/proofs/portrait_001_thumb.jpg',
            name: 'portrait_color_proof.jpg',
            size: 245000,
            mimeType: 'image/jpeg',
            uploadedAt: new Date("2024-01-14T14:00:00Z"),
            uploadedBy: 'ST-002'
        }],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_003',
            relatedNumber: 'ORD-2024-000003',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: '',
            whatsappPhoneNumber: '',
            emailMessageId: 'em_123457',
            emailThreadId: '',
            smsMessageId: '',
            sentVia: SendChannel.EMAIL,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.READ,
        sentAt: new Date("2024-01-14T14:00:00Z"),
        deliveredAt: new Date("2024-01-14T14:00:10Z"),
        readAt: new Date("2024-01-14T14:15:00Z"),
        readBy: ['CL-003'],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-14T14:00:00Z"),
        updatedAt: new Date("2024-01-14T14:15:00Z"),
        createdBy: 'ST-002',
        ipAddress: ''
    },
    {
        _id: 'msg_006',
        thread: 'thread_003',
        replyTo: 'msg_005',
        replyCount: 0,
        from: {
            type: ParticipantType.CLIENT,
            id: 'CL-003',
            name: 'Davis Portrait',
            phone: '+254733556677',
            email: 'davis@email.com',
            avatar: ''
        },
        to: [gilbertParticipant],
        subject: '',
        body: 'The colors look perfect! Ready to print.',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_003',
            relatedNumber: 'ORD-2024-000003',
            priority: MessagePriority.NORMAL,
            requiresAction: false,
            actionBy: null,
            assignedTo: null,
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: '',
            whatsappPhoneNumber: '',
            emailMessageId: 'em_123458',
            emailThreadId: 'thread_abc',
            smsMessageId: '',
            sentVia: SendChannel.EMAIL,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.READ,
        sentAt: new Date("2024-01-14T16:20:00Z"),
        deliveredAt: new Date("2024-01-14T16:20:05Z"),
        readAt: new Date("2024-01-14T16:21:00Z"),
        readBy: ['ST-002'],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-14T16:20:00Z"),
        updatedAt: new Date("2024-01-14T16:21:00Z"),
        createdBy: 'CL-003',
        ipAddress: ''
    },
    {
        _id: 'msg_007',
        thread: 'thread_006',
        replyTo: null,
        replyCount: 1,
        from: {
            type: ParticipantType.STAFF,
            id: 'ST-004',
            name: 'Sarah Johnson',
            phone: '',
            email: '',
            avatar: ''
        },
        to: [jackyParticipant, gilbertParticipant],
        subject: '',
        body: 'We\'re short on the 5x7 prints for order ORD-002. Only 5 available, need 10.',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_002',
            relatedNumber: 'ORD-2024-000002',
            priority: MessagePriority.HIGH,
            requiresAction: true,
            actionBy: new Date("2024-01-16T09:00:00Z"),
            assignedTo: 'ST-002',
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: '',
            whatsappPhoneNumber: '',
            emailMessageId: '',
            emailThreadId: '',
            smsMessageId: '',
            sentVia: SendChannel.IN_APP,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.READ,
        sentAt: new Date("2024-01-15T09:30:00Z"),
        deliveredAt: new Date("2024-01-15T09:30:01Z"),
        readAt: new Date("2024-01-15T09:31:00Z"),
        readBy: ['ST-001', 'ST-002'],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-15T09:30:00Z"),
        updatedAt: new Date("2024-01-15T09:31:00Z"),
        createdBy: 'ST-004',
        ipAddress: ''
    },
    {
        _id: 'msg_008',
        thread: 'thread_006',
        replyTo: 'msg_007',
        replyCount: 0,
        from: {
            type: ParticipantType.STAFF,
            id: 'ST-002',
            name: 'Gilbert Mwangi',
            phone: '',
            email: '',
            avatar: ''
        },
        to: [sarahParticipant, jackyParticipant],
        subject: '',
        body: 'Found alternative supplier who can deliver 10 prints by tomorrow. Proceeding?',
        bodyType: BodyType.TEXT,
        attachments: [],
        context: {
            relatedTo: RelatedEntityType.ORDER,
            relatedId: 'ord_002',
            relatedNumber: 'ORD-2024-000002',
            priority: MessagePriority.HIGH,
            requiresAction: true,
            actionBy: null,
            assignedTo: 'ST-001',
            actionTaken: '',
            actionTakenAt: null,
            tags: []
        },
        external: {
            whatsappMessageId: '',
            whatsappPhoneNumber: '',
            emailMessageId: '',
            emailThreadId: '',
            smsMessageId: '',
            sentVia: SendChannel.IN_APP,
            externalStatus: '',
            externalError: '',
            retryCount: 0,
            lastRetryAt: null
        },
        status: MessageStatus.DELIVERED,
        sentAt: new Date("2024-01-15T10:30:00Z"),
        deliveredAt: new Date("2024-01-15T10:30:02Z"),
        readAt: null,
        readBy: [],
        reactions: [],
        isEdited: false,
        editedAt: null,
        originalBody: '',
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:02Z"),
        createdBy: 'ST-002',
        ipAddress: ''
    }
];

// Message Stats
const messageStats = {
    date: new Date(),
    totalThreads: 6,
    unreadTotal: 3,
    byType: {
        [ThreadType.CLIENT]: 5,
        [ThreadType.INTERNAL]: 1,
        [ThreadType.SYSTEM]: 0,
        [ThreadType.SUPPLIER]: 0
    },
    byPriority: {
        [MessagePriority.URGENT]: 0,
        [MessagePriority.HIGH]: 1,
        [MessagePriority.NORMAL]: 5,
        [MessagePriority.LOW]: 0
    },
    actionRequired: 2,
    pinned: 1,
    messagesToday: 5,
    messagesThisWeek: 12
};

// Message Templates
const messageTemplates = [
    {
        id: 'temp_001',
        name: 'Order Confirmation',
        subject: 'Your order #{{orderId}} has been confirmed',
        content: 'Dear {{clientName}},\n\nThank you for your order! We\'re pleased to confirm that order #{{orderId}} has been received and is being processed.\n\nOrder Details:\n- Type: {{orderType}}\n- Estimated completion: {{estimatedDate}}\n\nWe\'ll notify you when your order is ready for shipping.\n\nBest regards,\nThe Lab Team',
        category: 'order',
        variables: ['clientName', 'orderId', 'orderType', 'estimatedDate']
    },
    {
        id: 'temp_002',
        name: 'Shipping Notification',
        subject: 'Your order #{{orderId}} has shipped!',
        content: 'Dear {{clientName}},\n\nGreat news! Your order #{{orderId}} has shipped via {{carrier}}.\n\nTracking Number: {{trackingNumber}}\nEstimated Delivery: {{estimatedDelivery}}\n\nYou can track your package at: {{trackingUrl}}\n\nThank you for your business!\nThe Lab Team',
        category: 'shipment',
        variables: ['clientName', 'orderId', 'carrier', 'trackingNumber', 'estimatedDelivery', 'trackingUrl']
    },
    {
        id: 'temp_003',
        name: 'Order Ready for Pickup',
        subject: 'Your order #{{orderId}} is ready for pickup',
        content: 'Dear {{clientName}},\n\nYour order #{{orderId}} is now ready for pickup at our location.\n\nPlease bring this email and a valid ID when picking up.\n\nOur hours: Monday-Friday 9am-6pm\n\nThank you!\nThe Lab Team',
        category: 'order',
        variables: ['clientName', 'orderId']
    },
    {
        id: 'temp_004',
        name: 'Payment Reminder',
        subject: 'Payment reminder for invoice #{{invoiceNumber}}',
        content: 'Dear {{clientName}},\n\nThis is a reminder that invoice #{{invoiceNumber}} for {{amount}} is due on {{dueDate}}.\n\nIf you have already made the payment, please disregard this message.\n\nThank you for your business!\nThe Lab Team',
        category: 'financial',
        variables: ['clientName', 'invoiceNumber', 'amount', 'dueDate']
    },
    {
        id: 'temp_005',
        name: 'Internal - Stock Alert',
        subject: '⚠️ Low Stock Alert: {{productName}}',
        content: 'Product {{productName}} (SKU: {{sku}}) is below reorder level.\n\nCurrent Stock: {{currentStock}}\nReorder Level: {{reorderLevel}}\n\nPlease place reorder as soon as possible.',
        category: 'internal',
        variables: ['productName', 'sku', 'currentStock', 'reorderLevel']
    }
];

// Quick Responses
const quickResponses = [
    { id: 'qr_001', text: 'Thank you for your message. I\'ll get back to you shortly.', category: 'general' },
    { id: 'qr_002', text: 'Your order has been processed and is in production.', category: 'order' },
    { id: 'qr_003', text: 'Your order has shipped! Tracking number will be provided soon.', category: 'shipment' },
    { id: 'qr_004', text: 'I\'ve checked your order status and it\'s on track for delivery.', category: 'order' },
    { id: 'qr_005', text: 'Let me look into this for you and get back to you shortly.', category: 'general' }
];

async function seedMessages() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Message.deleteMany({}),
            MessageThread.deleteMany({}),
            MessageStats.deleteMany({}),
            MessageTemplate.deleteMany({}),
            QuickResponse.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Message Threads
        console.log('💬 Seeding message threads...');
        await MessageThread.insertMany(messageThreads);
        console.log(`✅ ${messageThreads.length} message threads seeded`);

        // Seed Messages
        console.log('📝 Seeding messages...');
        await Message.insertMany(messages);
        console.log(`✅ ${messages.length} messages seeded`);

        // Seed Message Stats
        console.log('📊 Seeding message statistics...');
        await MessageStats.create(messageStats);
        console.log('✅ Message statistics seeded');

        // Seed Message Templates
        console.log('📋 Seeding message templates...');
        await MessageTemplate.insertMany(messageTemplates);
        console.log(`✅ ${messageTemplates.length} message templates seeded`);

        // Seed Quick Responses
        console.log('⚡ Seeding quick responses...');
        await QuickResponse.insertMany(quickResponses);
        console.log(`✅ ${quickResponses.length} quick responses seeded`);

        // Verify counts
        const counts = await Promise.all([
            MessageThread.countDocuments(),
            Message.countDocuments(),
            MessageStats.countDocuments(),
            MessageTemplate.countDocuments(),
            QuickResponse.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Message Threads: ${counts[0]}`);
        console.log(`   Messages: ${counts[1]}`);
        console.log(`   Message Stats: ${counts[2]}`);
        console.log(`   Message Templates: ${counts[3]}`);
        console.log(`   Quick Responses: ${counts[4]}`);

        // Thread type breakdown
        const threadBreakdown = await MessageThread.aggregate([
            {
                $group: {
                    _id: "$threadType",
                    count: { $sum: 1 },
                    totalMessages: { $sum: "$messageCount" },
                    totalUnread: { $sum: "$unreadCount" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (threadBreakdown.length > 0) {
            console.log('\n📈 Thread Type Breakdown:');
            threadBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} threads, ${item.totalMessages} messages, ${item.totalUnread} unread`);
            });
        }

        // Message status breakdown
        const statusBreakdown = await Message.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (statusBreakdown.length > 0) {
            console.log('\n📊 Message Status Breakdown:');
            statusBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} messages`);
            });
        }

        // Priority breakdown
        const priorityBreakdown = await MessageThread.aggregate([
            {
                $group: {
                    _id: "$businessContext.priority",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (priorityBreakdown.length > 0) {
            console.log('\n⚡ Priority Breakdown:');
            priorityBreakdown.forEach(item => {
                console.log(`   ${item._id}: ${item.count} threads`);
            });
        }

        console.log('\n✅ Messages seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding messages:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedMessages();