// lib/models/Invitation.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
  invitedBy: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  email: string;
  phone: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: Date;
  acceptedAt?: Date;
  acceptedBy?: mongoose.Types.ObjectId;
  revokedAt?: Date;
  revokedBy?: mongoose.Types.ObjectId;
  resentCount: number;
  lastResentAt?: Date;
  createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>({
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], 
    default: 'PENDING' 
  },
  expiresAt: { type: Date, required: true },
  acceptedAt: Date,
  acceptedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  revokedAt: Date,
  revokedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  resentCount: { type: Number, default: 0 },
  lastResentAt: Date
}, { timestamps: true });

InvitationSchema.index({ token: 1 });
InvitationSchema.index({ staff: 1, status: 1 });

export default mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);