// lib/models/Staff.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  role: string;
  department: string;
  hireDate: Date;
  userAccount?: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'INACTIVE';
  defaultPermissions?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  hireDate: { type: Date, required: true },
  userAccount: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  defaultPermissions: [{
    resource: String,
    actions: [String]
  }]
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);