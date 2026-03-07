/*import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { SecurityLog } from '@/lib/models';
import Client from '@/models/Clients';
import { SystemRole, User } from '@/models/Users';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

interface RegistrationInput {
  email: string;
  phone: string;
  password: string;
  name: string;
  tradingName?: string;
  businessType?: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NGO';
  address?: string;
  city?: string;
  source?: 'WEB' | 'APP' | 'REFERRAL' | 'WALK_IN';
  referralCode?: string;
}

function validateInput(data: RegistrationInput): string[] {
  const errors: string[] = [];
  
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.phone || !/^(\+254|0)[17]\d{8}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Valid Kenyan phone number is required');
  }
  
  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Full name is required');
  }
  
  return errors;
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  }
  return cleaned;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(req: NextRequest) {
  // IMPORTANT: Ensure models are registered before transaction
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body: RegistrationInput = await req.json();
    console.log('[REGISTRATION] Received body:', body);
    
    const validationErrors = validateInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const { email, password, name, tradingName, businessType = 'INDIVIDUAL', address, city = 'Nairobi', source = 'WEB' } = body;
    const phone = normalizePhone(body.phone);
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone }]
    }).session(session).lean();

    if (existingUser) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Account already exists' },
        { status: 409 }
      );
    }

    // Check existing client
    const existingClient = await Client.findOne({
      $or: [{ emails: normalizedEmail }, { 'phones.number': phone }]
    }).session(session).lean();

    if (existingClient) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Client record exists' },
        { status: 409 }
      );
    }

    // Get or create system staff ID for createdBy
    // Option A: If you have a system staff ID in env
    let systemStaffId = process.env.SYSTEM_STAFF_ID 
      ? new mongoose.Types.ObjectId(process.env.SYSTEM_STAFF_ID)
      : null;
      
    // Option B: If no system staff, use null and handle in schema (recommended to make createdBy optional)
    // For now, let's create client without requiring valid Staff reference if systemStaffId is null
    // by using a temporary ObjectId that will fail validation if createdBy is required:true
    if (!systemStaffId) {
      // Create a placeholder - you should create a real system staff user in your DB
      systemStaffId = new mongoose.Types.ObjectId('000000000000000000000000');
    }

    // 1. CREATE CLIENT
    const clientData = {
      clientType: businessType,
      name: name.trim(),
      tradingName: tradingName?.trim() || name.trim(),
      phones: [{
        phoneType: 'MOBILE' as const,
        number: phone,
        isPrimary: true,
        isVerified: false,
        whatsappEnabled: true,
        callConsent: true
      }],
      emails: [normalizedEmail],
      category: 'RETAIL' as const,
      paymentTerms: 0,
      createdBy: systemStaffId, // This matches your schema requirement
      addresses: address ? [{
        addressType: 'SHIPPING' as const,
        street: address,
        city: city,
        country: 'Kenya',
        isDefault: true,
        active: true,
        addedAt: new Date()
      }] : []
    };

    // Use create with session - returns array when using session
    const clients = await Client.create([clientData], { session });
    const client = clients[0];

    // 2. CREATE USER
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userData = {
      email: normalizedEmail,
      phone,
      passwordHash: hashedPassword, // NOT 'password' - must match schema
      accountType: 'CLIENT' as const,
      clientProfile: client._id,
      role: 'CLIENT' as SystemRole,
      // DO NOT include roleLevel here - let the pre-save hook set it based on role
      // DO NOT include permissions - let defaults/schema handle it
      createdVia: 'SELF_REGISTRATION' as const,
      status: 'ACTIVE' as const,
      passwordChangedAt: new Date(),
      security: {
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        lastPasswordReset: new Date(),
        mustChangePassword: false,
        passwordHistory: [hashedPassword],
        trustedDevices: []
      }
      // Note: invitedBy is optional per schema
    };

    // Create user - returns array when using session
    const users = await User.create([userData], { session });
    const user = users[0];

    // 3. LINK BACK (if userAccount field exists in Client schema)
    try {
      await Client.findByIdAndUpdate(
        client._id,
        { $set: { userAccount: user._id } },
        { session, runValidators: false }
      );
    } catch (linkError) {
      console.warn('Could not link userAccount:', linkError);
    }

    // 4. SECURITY LOG
    await SecurityLog.create([{
      user: user._id,
      action: 'CLIENT_REGISTERED',
      severity: 'INFO',
      details: {
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        success: true,
        metadata: {
          clientId: client._id,
          clientNumber: client.clientNumber,
          source
        }
      }
    }], { session });

    await session.commitTransaction();

    // 5. CREATE SESSION
    const deviceInfo = {
      device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      fingerprint: 'web-default'
    };

    const userSession = await user.createSession(deviceInfo, 'CLIENT_PORTAL');

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          accountType: user.accountType,
          role: user.role
        },
        client: {
          id: client._id,
          clientNumber: client.clientNumber,
          name: client.name
        },
        session: {
          token: userSession.token,
          refreshToken: userSession.refreshToken,
          expiresAt: userSession.expiresAt
        }
      }
    }, { status: 201 });

  } catch (error: any) {
    await session.abortTransaction();
    console.error('[REGISTRATION ERROR]', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate entry', message: 'Account already exists' },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => `${e.path}: ${e.message}`);
      return NextResponse.json(
        { success: false, error: 'Validation error', details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed', message: error.message },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  if (!email && !phone) {
    return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
  }

  try {
    const query: any = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = normalizePhone(phone);

    const exists = await User.exists(query);
    return NextResponse.json({ available: !exists });
  } catch (error) {
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}*/




import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Client from '@/models/Clients';
import { SecurityLog, SystemRole, User } from '@/models/Users';
import dbConnect from '@/lib/db/mongoose';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

interface RegistrationInput {
  email: string;
  phone: string;
  password: string;
  name: string;
  tradingName?: string;
  businessType?: 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT' | 'NGO';
  address?: string;
  city?: string;
  source?: 'WEB' | 'APP' | 'REFERRAL' | 'WALK_IN';
  referralCode?: string;
}

function validateInput(data: RegistrationInput): string[] {
  const errors: string[] = [];

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }

  if (!data.phone || !/^(\+254|0)[17]\d{8}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Valid Kenyan phone number is required');
  }

  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Full name is required');
  }

  return errors;
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  }
  return cleaned;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(req: NextRequest) {
   await dbConnect();
  console.log('[REGISTRATION] Starting registration process...');
  
  await mongoose.connect(process.env.MONGODB_URI!);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body: RegistrationInput = await req.json();
    console.log('[REGISTRATION] Received body:', body);

    // -----------------------------
    // 1. VALIDATE INPUT
    // -----------------------------
    const validationErrors = validateInput(body);
    if (validationErrors.length > 0) {
      console.warn('[REGISTRATION] Validation failed:', validationErrors);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const { email, password, name, tradingName, businessType = 'INDIVIDUAL', address, city = 'Nairobi', source = 'WEB' } = body;
    const phone = normalizePhone(body.phone);
    const normalizedEmail = email.toLowerCase().trim();

    console.log(`[REGISTRATION] Normalized Email: ${normalizedEmail}, Phone: ${phone}`);

    // -----------------------------
    // 2. CHECK EXISTING USER
    // -----------------------------
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone }]
    }).session(session).lean();

    if (existingUser) {
      console.warn('[REGISTRATION] User already exists:', existingUser._id);
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Account already exists' },
        { status: 409 }
      );
    }

    // -----------------------------
    // 3. CHECK EXISTING CLIENT
    // -----------------------------
    const existingClient = await Client.findOne({
      $or: [{ emails: normalizedEmail }, { 'phones.number': phone }]
    }).session(session).lean();

    if (existingClient) {
      console.warn('[REGISTRATION] Client already exists:', existingClient._id);
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: 'Client record exists' },
        { status: 409 }
      );
    }

    // -----------------------------
    // 4. GET SYSTEM STAFF
    // -----------------------------
    let systemStaffId = process.env.SYSTEM_STAFF_ID
      ? new mongoose.Types.ObjectId(process.env.SYSTEM_STAFF_ID)
      : new mongoose.Types.ObjectId('000000000000000000000000'); // placeholder

    console.log('[REGISTRATION] Using systemStaffId:', systemStaffId.toHexString());

    // -----------------------------
    // 5. CREATE CLIENT
    // -----------------------------
    const clientData = {
      clientType: businessType,
      name: name.trim(),
      tradingName: tradingName?.trim() || name.trim(),
      phones: [{
        phoneType: 'MOBILE' as const,
        number: phone,
        isPrimary: true,
        isVerified: false,
        whatsappEnabled: true,
        callConsent: true
      }],
      emails: [normalizedEmail],
      category: 'RETAIL' as const,
      paymentTerms: 0,
      createdBy: systemStaffId,
      addresses: address ? [{
        addressType: 'SHIPPING' as const,
        street: address,
        city: city,
        country: 'Kenya',
        isDefault: true,
        active: true,
        addedAt: new Date()
      }] : []
    };

    console.log('[REGISTRATION] Creating client...');
    const clients = await Client.create([clientData], { session });
    const client = clients[0];
    console.log('[REGISTRATION] Client created:', client._id);

    // -----------------------------
    // 6. CREATE USER
    // -----------------------------
    console.log('[REGISTRATION] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      email: normalizedEmail,
      phone,
      passwordHash: hashedPassword,
      accountType: 'CLIENT' as const,
      clientProfile: client._id,
      role: 'CLIENT' as SystemRole,
      createdVia: 'SELF_REGISTRATION' as const,
      status: 'ACTIVE' as const,
      passwordChangedAt: new Date(),
      security: {
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        lastPasswordReset: new Date(),
        mustChangePassword: false,
        passwordHistory: [hashedPassword],
        trustedDevices: []
      }
    };

    console.log('[REGISTRATION] Creating user...');
    const users = await User.create([userData], { session });
    const user = users[0];
    console.log('[REGISTRATION] User created:', user._id);

    // -----------------------------
    // 7. LINK CLIENT -> USER
    // -----------------------------
    try {
      await Client.findByIdAndUpdate(
        client._id,
        { $set: { userAccount: user._id } },
        { session, runValidators: false }
      );
      console.log('[REGISTRATION] Linked userAccount to client');
    } catch (linkError) {
      console.warn('[REGISTRATION] Could not link userAccount:', linkError);
    }

    // -----------------------------
    // 8. SECURITY LOG
    // -----------------------------
    console.log('[REGISTRATION] Creating security log...');
    await SecurityLog.create([{
      user: user._id,
      action: 'CLIENT_REGISTERED',
      severity: 'INFO',
      details: {
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        success: true,
        metadata: {
          clientId: client._id,
          clientNumber: client.clientNumber,
          source
        }
      }
    }], { session });

    await session.commitTransaction();
    console.log('[REGISTRATION] Transaction committed');

    // -----------------------------
    // 9. CREATE SESSION
    // -----------------------------
    const deviceInfo = {
      device: req.headers.get('sec-ch-ua-platform') || 'Unknown',
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      fingerprint: 'web-default'
    };

    console.log('[REGISTRATION] Creating user session...');
    const userSession = await user.createSession(deviceInfo, 'CLIENT_PORTAL');

    console.log('[REGISTRATION] Registration complete for user:', user._id);
    /*return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          accountType: user.accountType,
          role: user.role
        },
        client: {
          id: client._id,
          clientNumber: client.clientNumber,
          name: client.name
        },
        session: {
          token: userSession.token,
          refreshToken: userSession.refreshToken,
          expiresAt: userSession.expiresAt
        }
      }
    }, { status: 201 });*/

    return NextResponse.json({
  success: true,
  message: 'Registration successful!',
  data: {
    user: {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: client.name,                 // 🔥 FIX
      role: user.role,
      clientId: client._id.toString(),
      clientNumber: client.clientNumber
    },
    client: {
      id: client._id.toString(),
      clientNumber: client.clientNumber,
      name: client.name,
      category: client.category
    },
    session: {
      token: userSession.token,
      refreshToken: userSession.refreshToken,
      expiresAt: userSession.expiresAt
    }
  }
}, { status: 201 });

  } catch (error: any) {
    await session.abortTransaction();
    console.error('[REGISTRATION ERROR]', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate entry', message: 'Account already exists' },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => `${e.path}: ${e.message}`);
      return NextResponse.json(
        { success: false, error: 'Validation error', details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed', message: error.message },
      { status: 500 }
    );
  } finally {
    session.endSession();
    console.log('[REGISTRATION] Session ended');
  }
}

// ============================================================================
// CHECK EMAIL/PHONE AVAILABILITY
// ============================================================================

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  if (!email && !phone) {
    console.warn('[CHECK AVAILABILITY] No email or phone provided');
    return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
  }

  try {
    const query: any = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = normalizePhone(phone);

    const exists = await User.exists(query);
    console.log(`[CHECK AVAILABILITY] Email/Phone availability: ${!exists}`);
    return NextResponse.json({ available: !exists });
  } catch (error) {
    console.error('[CHECK AVAILABILITY ERROR]', error);
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}