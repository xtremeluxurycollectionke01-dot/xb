// app/api/bootstrap/route.ts

import dbConnect from '@/lib/db/mongoose';
import { User } from '@/models/Users';
import Staff from '@/models/Staff';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function POST() {
  await dbConnect();

  // Check if any admin already exists
  const existingAdmin = await User.findOne({ role: 'ADMIN' }).populate('staff');
  if (existingAdmin) {
    return NextResponse.json({ 
      message: 'Admin already exists',
      admin: {
        email: existingAdmin.email,
        employeeId: existingAdmin.employeeId,
        staffName: existingAdmin.staff && typeof existingAdmin.staff === 'object' 
          ? `${(existingAdmin.staff as any).firstName} ${(existingAdmin.staff as any).lastName}` 
          : null
      }
    });
  }

  // Start a session for transaction
  const mongoose_instance = await dbConnect();
  const session = await mongoose_instance.startSession();
  
  try {
    let staffDoc: any;
    let userDoc: any;

    await session.withTransaction(async () => {
      // STEP 1: Create Staff WITHOUT user field first (temporarily bypass validation)
      // We need to use a different approach since user is required in schema
      
      // Instead, create a temporary ObjectId for the user that we'll update later
      const tempUserId = new mongoose.Types.ObjectId();
      
      const staffData = {
        user: tempUserId, // Placeholder, will update with real user ID after user creation
        employeeId: 'EMP-001',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@company.com',
        phone: '0700000000',
        role: {
          name: 'ADMIN' as const,
          displayName: 'System Administrator',
          description: 'Full system access',
          permissions: [
            {
              resource: 'ORDER' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] as const
            },
            {
              resource: 'INVOICE' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE', 'APPROVE', 'VOID', 'EXPORT', 'ADMIN'] as const
            },
            {
              resource: 'QUOTATION' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ISSUE', 'APPROVE'] as const
            },
            {
              resource: 'CASH_SALE' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'ISSUE', 'VOID'] as const
            },
            {
              resource: 'PRICE' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const
            },
            {
              resource: 'STOCK' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const
            },
            {
              resource: 'PRODUCT' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const
            },
            {
              resource: 'CLIENT' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const
            },
            {
              resource: 'STAFF' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const
            },
            {
              resource: 'REPORT' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'ADMIN'] as const
            },
            {
              resource: 'DASHBOARD' as const,
              actions: ['READ', 'ADMIN'] as const
            },
            {
              resource: 'PACKAGING' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const
            },
            {
              resource: 'DOCUMENT' as const,
              actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT'] as const
            }
          ]
        },
        schedule: {
          monday: { start: '08:00', end: '17:00', isWorkingDay: true, breakStart: '13:00', breakEnd: '14:00' },
          tuesday: { start: '08:00', end: '17:00', isWorkingDay: true, breakStart: '13:00', breakEnd: '14:00' },
          wednesday: { start: '08:00', end: '17:00', isWorkingDay: true, breakStart: '13:00', breakEnd: '14:00' },
          thursday: { start: '08:00', end: '17:00', isWorkingDay: true, breakStart: '13:00', breakEnd: '14:00' },
          friday: { start: '08:00', end: '17:00', isWorkingDay: true, breakStart: '13:00', breakEnd: '14:00' },
          saturday: { isWorkingDay: false },
          sunday: { isWorkingDay: false }
        },
        timezone: 'Africa/Nairobi',
        isActive: true,
        joinedAt: new Date()
      };

      // Create staff document
      staffDoc = new Staff(staffData);
      await staffDoc.save({ session });

      // STEP 2: Create User with reference to the staff document
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      
      const userData = {
        staff: staffDoc._id, // Now we have the real staff ID
        employeeId: 'EMP-001',
        email: 'admin@company.com',
        phone: '0700000000',
        passwordHash: hashedPassword,
        role: 'ADMIN' as const,
        roleLevel: 4,
        status: 'ACTIVE' as const,
        // For invitedBy, we need a User ID - but we don't have one yet
        // We'll use staffDoc._id as placeholder and update after user creation
        invitedBy: staffDoc._id, // Temporary - will update with real user ID
        permissions: [
          { resource: 'ORDER' as const, actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] as const },
          { resource: 'INVOICE' as const, actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'ADMIN'] as const },
          { resource: 'PRODUCT' as const, actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const },
          { resource: 'STOCK' as const, actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const },
          { resource: 'CLIENT' as const, actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const },
          { resource: 'STAFF' as const, actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ADMIN'] as const },
          { resource: 'REPORT' as const, actions: ['READ', 'EXPORT', 'ADMIN'] as const },
          { resource: 'DASHBOARD' as const, actions: ['READ', 'UPDATE', 'ADMIN'] as const },
          { resource: 'SETTINGS' as const, actions: ['READ', 'UPDATE', 'ADMIN'] as const },
          { resource: 'SYSTEM' as const, actions: ['ADMIN'] as const }
        ],
        security: {
          failedLoginAttempts: 0,
          twoFactorEnabled: false,
          lastPasswordReset: new Date(),
          mustChangePassword: false,
          passwordHistory: [hashedPassword],
          trustedDevices: []
        }
      };

      // Create user document
      userDoc = new User(userData);
      await userDoc.save({ session });

      // STEP 3: Update Staff with the real user ID
      staffDoc.user = userDoc._id;
      await staffDoc.save({ session });

      // STEP 4: Update User with correct invitedBy (now that we have the user ID)
      userDoc.invitedBy = userDoc._id; // Self-invited for bootstrap
      await userDoc.save({ session });

      // STEP 5: Create initial login history entry
      if (userDoc.loginHistory) {
        userDoc.loginHistory.push({
          timestamp: new Date(),
          ipAddress: '127.0.0.1',
          device: 'System Bootstrap',
          userAgent: 'System Installation',
          success: true,
          method: 'PASSWORD'
        });
      }
      
      await userDoc.save({ session });

      // STEP 6: Log activity in staff record
      try {
        await staffDoc.logActivity(
          'LOGIN',
          'STAFF',
          {
            metadata: { 
              action: 'ACCOUNT_CREATED',
              method: 'BOOTSTRAP'
            },
            ipAddress: '127.0.0.1',
            userAgent: 'System Installation'
          }
        );
      } catch (logError) {
        console.log('Activity logging skipped - method may not be available yet');
        // If logActivity method isn't available, just continue
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin bootstrapped successfully',
      credentials: {
        employeeId: 'EMP-001',
        email: 'admin@company.com',
        password: 'Admin@123',
        note: 'Please change password on first login'
      }
    });

  } catch (error) {
    console.error('Bootstrap error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to bootstrap admin',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}

// Optional: GET endpoint to check bootstrap status
export async function GET() {
  await dbConnect();
  
  const adminCount = await User.countDocuments({ role: 'ADMIN' });
  const staffCount = await Staff.countDocuments({ 'role.name': 'ADMIN' });
  
  return NextResponse.json({
    isBootstrapped: adminCount > 0 && staffCount > 0,
    stats: {
      adminUsers: adminCount,
      adminStaff: staffCount
    }
  });
}