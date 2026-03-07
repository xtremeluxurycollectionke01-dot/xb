// scripts/fix-staff-schedules.ts
import 'dotenv/config'; // automatically loads .env into process.env
import mongoose from 'mongoose';
//import Staff, { IWorkSchedule, IScheduleDay } from '@/models/Staff';
import Staff, { IWorkSchedule, IScheduleDay } from '../models/Staff';


// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
type DayKey = keyof IWorkSchedule; // 'monday' | 'tuesday' | ... | 'sunday'

// Default working hours
const DEFAULT_WEEKDAY: IScheduleDay = { start: '08:00', end: '17:00', isWorkingDay: true };
const DEFAULT_WEEKEND: IScheduleDay = { start: '09:00', end: '13:00', isWorkingDay: false };
const DAYS: DayKey[] = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

// ----------------------------------------------------------------------------
// Database connection helper
// ----------------------------------------------------------------------------
async function dbConnect() {
  if (mongoose.connection.readyState === 0) {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not defined in environment');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  }
}

// ----------------------------------------------------------------------------
// Fix staff schedules
// ----------------------------------------------------------------------------
async function fixStaffSchedules() {
  try {
    await dbConnect();

    const staffList = await Staff.find({});
    console.log(`Found ${staffList.length} staff records to check`);

    for (const staff of staffList) {
      let modified = false;

      // If no schedule, create default
      if (!staff.schedule) {
        console.log(`Staff ${staff.employeeId} has no schedule, adding default`);
        staff.schedule = {
          monday: { ...DEFAULT_WEEKDAY },
          tuesday: { ...DEFAULT_WEEKDAY },
          wednesday: { ...DEFAULT_WEEKDAY },
          thursday: { ...DEFAULT_WEEKDAY },
          friday: { ...DEFAULT_WEEKDAY },
          saturday: { ...DEFAULT_WEEKEND },
          sunday: { ...DEFAULT_WEEKEND },
        };
        modified = true;
      } else {
        // Fill in missing days or fields
        for (const day of DAYS) {
          const currentDay = staff.schedule[day];
          if (!currentDay) {
            staff.schedule[day] = (day === 'saturday' || day === 'sunday') ? { ...DEFAULT_WEEKEND } : { ...DEFAULT_WEEKDAY };
            console.log(`Staff ${staff.employeeId} missing ${day}, added default`);
            modified = true;
          } else {
            let dayModified = false;
            if (!currentDay.start) { currentDay.start = (day === 'saturday' || day === 'sunday') ? '09:00' : '08:00'; dayModified = true; }
            if (!currentDay.end) { currentDay.end = (day === 'saturday' || day === 'sunday') ? '13:00' : '17:00'; dayModified = true; }
            if (currentDay.isWorkingDay === undefined) { currentDay.isWorkingDay = day !== 'saturday' && day !== 'sunday'; dayModified = true; }
            if (dayModified) modified = true;
          }
        }
      }

      if (modified) {
        staff.markModified('schedule');
        await staff.save();
        console.log(`✅ Updated staff ${staff.employeeId}`);
      } else {
        console.log(`✓ Staff ${staff.employeeId} schedule is OK`);
      }
    }

    console.log('🎉 Schedule fix complete!');
  } catch (error) {
    console.error('❌ Error fixing staff schedules:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// ----------------------------------------------------------------------------
// Run script
// ----------------------------------------------------------------------------
fixStaffSchedules();