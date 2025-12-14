import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    // Attempt to connect to the database
    const connection = await dbConnect();
    
    // Get detailed connection status
    const isConnected = connection.connection.readyState === 1;
    const readyState = connection.connection.readyState;
    const readyStateLabels: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get connection details
    const connectionDetails = {
      host: connection.connection.host,
      port: connection.connection.port,
      name: connection.connection.name,
      models: Object.keys(connection.models).length,
      collections: Object.keys(connection.connection.collections).length
    };
    
    // Get stats if connected
    let stats = {};
    if (isConnected && connection.connection.db) {
      try {
        // Basic connection info
        stats = {
          ok: true
        };
      } catch (statsError: unknown) {
        stats = {
          ok: false,
          error: statsError instanceof Error ? statsError.message : 'Unknown error'
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      connected: isConnected,
      readyState: {
        code: readyState,
        label: readyStateLabels[readyState] || 'unknown'
      },
      connection: connectionDetails,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('[Health Check] Database connection failed:', error);
    
    // Create a more specific error object
    let errorMessage = 'Unknown error';
    let errorName = 'Error';
    let errorCode = 'UNKNOWN';
    let errorStack: string | undefined;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorName = error.name;
      errorStack = error.stack;
      
      // Try to extract code if it exists - using safer type checking
      if ('code' in error && typeof error.code === 'string') {
        errorCode = error.code;
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: {
        message: errorMessage,
        name: errorName,
        code: errorCode,
        ...(errorStack && { stack: errorStack })
      },
      timestamp: new Date().toISOString(),
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}