// models/message.model.js
import mongoose from 'mongoose';

// Thread Types enum
const ThreadType = {
    INTERNAL: 'INTERNAL',
    CLIENT: 'CLIENT',
    SUPPLIER: 'SUPPLIER',
    SYSTEM: 'SYSTEM'
};

// Participant Types enum
const ParticipantType = {
    STAFF: 'STAFF',
    CLIENT: 'CLIENT',
    SYSTEM: 'SYSTEM',
    WHATSAPP_API: 'WHATSAPP_API',
    EMAIL_GATEWAY: 'EMAIL_GATEWAY'
};

// Related Entity Types enum
const RelatedEntityType = {
    ORDER: 'ORDER',
    INVOICE: 'INVOICE',
    QUOTATION: 'QUOTATION',
    DELIVERY: 'DELIVERY',
    STOCK: 'STOCK',
    PRODUCT: 'PRODUCT',
    CLIENT: 'CLIENT',
    GENERAL: 'GENERAL'
};

// Message Priority enum
const MessagePriority = {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    URGENT: 'URGENT'
};

// Attachment Types enum
const AttachmentType = {
    IMAGE: 'IMAGE',
    DOCUMENT: 'DOCUMENT',
    VOICE: 'VOICE',
    VIDEO: 'VIDEO',
    PDF: 'PDF',
    SPREADSHEET: 'SPREADSHEET'
};

// Send Channels enum
const SendChannel = {
    APP: 'APP',
    WHATSAPP_API: 'WHATSAPP_API',
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    IN_APP: 'IN_APP'
};

// Message Status enum
const MessageStatus = {
    DRAFT: 'DRAFT',
    QUEUED: 'QUEUED',
    SENT: 'SENT',
    DELIVERED: 'DELIVERED',
    READ: 'READ',
    REPLIED: 'REPLIED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED'
};

// Body Types enum
const BodyType = {
    TEXT: 'TEXT',
    HTML: 'HTML',
    MARKDOWN: 'MARKDOWN'
};

// Participant schema
const participantSchema = new mongoose.Schema({
    participantType: { 
        type: String, 
        enum: Object.values(ParticipantType),
        required: true 
    },
    participantId: { type: String, default: null },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: '' },
    readAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, required: true },
    leftAt: { type: Date, default: null }
}, { _id: false });

// Attachment schema
const attachmentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    attachmentType: { 
        type: String, 
        enum: Object.values(AttachmentType),
        required: true 
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    name: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, required: true },
    uploadedBy: { type: String, required: true }
}, { _id: false });

// Business Context schema
const businessContextSchema = new mongoose.Schema({
    relatedTo: { 
        type: String, 
        enum: Object.values(RelatedEntityType),
        required: true 
    },
    relatedId: { type: String, default: null },
    relatedNumber: { type: String, default: '' },
    priority: { 
        type: String, 
        enum: Object.values(MessagePriority),
        default: MessagePriority.NORMAL 
    },
    requiresAction: { type: Boolean, default: false },
    actionBy: { type: Date, default: null },
    assignedTo: { type: String, default: null },
    actionTaken: { type: String, default: '' },
    actionTakenAt: { type: Date, default: null },
    tags: { type: [String], default: [] }
}, { _id: false });

// External Tracking schema
const externalTrackingSchema = new mongoose.Schema({
    whatsappMessageId: { type: String, default: '' },
    whatsappPhoneNumber: { type: String, default: '' },
    emailMessageId: { type: String, default: '' },
    emailThreadId: { type: String, default: '' },
    smsMessageId: { type: String, default: '' },
    sentVia: { 
        type: String, 
        enum: Object.values(SendChannel),
        default: SendChannel.IN_APP 
    },
    externalStatus: { type: String, default: '' },
    externalError: { type: String, default: '' },
    retryCount: { type: Number, default: 0 },
    lastRetryAt: { type: Date, default: null }
}, { _id: false });

// Message Sender schema
const messageSenderSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: Object.values(ParticipantType),
        required: true 
    },
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: '' }
}, { _id: false });

// Reaction schema
const reactionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    emoji: { type: String, required: true },
    userId: { type: String, required: true },
    reactedAt: { type: Date, required: true }
}, { _id: false });

// MESSAGE SCHEMA
const messageSchema = new mongoose.Schema({
    // --- Identity ---
    _id: { type: String, required: true },
    thread: { type: String, required: true, index: true },
    replyTo: { type: String, default: null },
    replyCount: { type: Number, default: 0 },

    // --- Sender ---
    from: { type: messageSenderSchema, required: true },

    // --- Recipients ---
    to: { type: [participantSchema], default: [] },

    // --- Content ---
    subject: { type: String, default: '' },
    body: { type: String, required: true },
    bodyType: { 
        type: String, 
        enum: Object.values(BodyType),
        default: BodyType.TEXT 
    },
    attachments: { type: [attachmentSchema], default: [] },

    // --- Business Context ---
    context: { type: businessContextSchema, required: true },

    // --- External ---
    external: { type: externalTrackingSchema, default: () => ({}) },

    // --- Status ---
    status: { 
        type: String, 
        enum: Object.values(MessageStatus),
        default: MessageStatus.DRAFT 
    },
    sentAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    readAt: { type: Date, default: null },
    readBy: { type: [String], default: [] },

    // --- Reactions ---
    reactions: { type: [reactionSchema], default: [] },

    // --- Edit History ---
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
    originalBody: { type: String, default: '' },

    // --- Audit ---
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: String, required: true },
    ipAddress: { type: String, default: '' }
}, { 
    collection: 'messages',
    _id: false,
    timestamps: true 
});

// Indexes for messages
messageSchema.index({ thread: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ 'from.id': 1, createdAt: -1 });
messageSchema.index({ 'context.relatedId': 1 });

// Pre-save middleware
messageSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// MESSAGE THREAD SCHEMA
const messageThreadSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    threadType: { 
        type: String, 
        enum: Object.values(ThreadType),
        required: true,
        index: true 
    },
    subject: { type: String, required: true },
    participants: { type: [participantSchema], required: true },
    businessContext: { type: businessContextSchema, required: true },
    lastMessageAt: { type: Date, required: true },
    lastMessagePreview: { type: String, default: '' },
    messageCount: { type: Number, default: 0 },
    unreadCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, { 
    collection: 'message_threads',
    _id: false,
    timestamps: true 
});

// Indexes for message threads
messageThreadSchema.index({ threadType: 1, updatedAt: -1 });
messageThreadSchema.index({ isPinned: 1, updatedAt: -1 });
messageThreadSchema.index({ isArchived: 1 });
messageThreadSchema.index({ 'participants.participantId': 1 });
messageThreadSchema.index({ unreadCount: 1 });

// Pre-save middleware
messageThreadSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// MESSAGE STATS SCHEMA
const messageStatsSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    totalThreads: { type: Number, default: 0 },
    unreadTotal: { type: Number, default: 0 },
    byType: {
        [ThreadType.CLIENT]: { type: Number, default: 0 },
        [ThreadType.INTERNAL]: { type: Number, default: 0 },
        [ThreadType.SYSTEM]: { type: Number, default: 0 },
        [ThreadType.SUPPLIER]: { type: Number, default: 0 }
    },
    byPriority: {
        [MessagePriority.URGENT]: { type: Number, default: 0 },
        [MessagePriority.HIGH]: { type: Number, default: 0 },
        [MessagePriority.NORMAL]: { type: Number, default: 0 },
        [MessagePriority.LOW]: { type: Number, default: 0 }
    },
    actionRequired: { type: Number, default: 0 },
    pinned: { type: Number, default: 0 },
    messagesToday: { type: Number, default: 0 },
    messagesThisWeek: { type: Number, default: 0 }
}, { 
    collection: 'message_stats',
    timestamps: true 
});

// MESSAGE TEMPLATE SCHEMA
const messageTemplateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    variables: { type: [String], default: [] }
}, { 
    collection: 'message_templates',
    timestamps: true 
});

// QUICK RESPONSE SCHEMA
const quickResponseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    category: { type: String, required: true }
}, { 
    collection: 'quick_responses',
    timestamps: true 
});

// Create and export models
export const Message = mongoose.model('Message', messageSchema);
export const MessageThread = mongoose.model('MessageThread', messageThreadSchema);
export const MessageStats = mongoose.model('MessageStats', messageStatsSchema);
export const MessageTemplate = mongoose.model('MessageTemplate', messageTemplateSchema);
export const QuickResponse = mongoose.model('QuickResponse', quickResponseSchema);

// Export enums
export {
    ThreadType,
    ParticipantType,
    RelatedEntityType,
    MessagePriority,
    AttachmentType,
    SendChannel,
    MessageStatus,
    BodyType
};