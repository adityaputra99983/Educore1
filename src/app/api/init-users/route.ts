import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import Teacher from '../../../models/Teacher';

/**
 * POST /api/init-users
 * 
 * Initialize the database with default users (for development only)
 */
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return NextResponse.json(
        { message: 'Users already initialized' },
        { status: 200 }
      );
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@namira.sch.id',
      password: 'SecurePass123!', // In production, this should be hashed
      role: 'admin',
      name: 'Administrator'
    });

    await adminUser.save();

    // Create teacher user
    const teacherUser = new User({
      email: 'teacher@namira.sch.id',
      password: 'TeacherPass123!', // In production, this should be hashed
      role: 'teacher',
      name: 'Guru Mata Pelajaran'
    });

    await teacherUser.save();

    return NextResponse.json({
      message: 'Users initialized successfully',
      users: [
        { email: 'admin@namira.sch.id', role: 'admin' },
        { email: 'teacher@namira.sch.id', role: 'teacher' }
      ]
    });
  } catch (error: unknown) {
    console.error('Error initializing users:', error);
    return NextResponse.json(
      { error: 'Failed to initialize users' },
      { status: 500 }
    );
  }
}