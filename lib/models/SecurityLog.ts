// lib/models/SecurityLog.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISecurityLog extends Document {
  user?: mongoose.Types.ObjectId;
  action: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: any;
  acknowledged: boolean;
  acknowledgedBy?: mongoose.Types.ObjectId;
  acknowledgedAt?: Date;
  acknowledgmentNotes?: string;
  createdAt: Date;
}

const SecurityLogSchema = new Schema<ISecurityLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['INFO', 'WARNING', 'CRITICAL'], 
    default: 'INFO' 
  },
  details: Schema.Types.Mixed,
  acknowledged: { type: Boolean, default: false },
  acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  acknowledgedAt: Date,
  acknowledgmentNotes: String
}, { timestamps: true });

SecurityLogSchema.index({ user: 1, createdAt: -1 });
SecurityLogSchema.index({ action: 1 });
SecurityLogSchema.index({ severity: 1 });

export default mongoose.models.SecurityLog || mongoose.model<ISecurityLog>('SecurityLog', SecurityLogSchema);