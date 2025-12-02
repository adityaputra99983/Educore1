<<<<<<< HEAD
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

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
      } catch (statsError) {
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
  } catch (error: any) {
    console.error('[Health Check] Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error?.name || 'Error',
        code: error?.code || 'UNKNOWN',
        ...(error instanceof Error && { stack: error.stack })
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
=======
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

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
      } catch (statsError) {
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
  } catch (error: any) {
    console.error('[Health Check] Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error?.name || 'Error',
        code: error?.code || 'UNKNOWN',
        ...(error instanceof Error && { stack: error.stack })
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
>>>>>>> 6e4a954937fec25b661d78aabe9237d139f19a73
