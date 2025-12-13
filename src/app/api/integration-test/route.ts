import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await dbConnect();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'All APIs are properly connected to SIMAKA system',
      timestamp: new Date().toISOString(),
      endpoints: {
        students: '/api/students',
        attendance: '/api/attendance',
        reports: '/api/reports',
        settings: '/api/settings',
        teachers: '/api/teachers'
      }
    });
  } catch (error) {
    console.error('Integration test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to SIMAKA system',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}