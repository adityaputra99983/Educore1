import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    // Attempt to connect to the database
    const connection = await dbConnect();
    
    // Get connection status
    const isConnected = connection.connection.readyState === 1;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      connected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}