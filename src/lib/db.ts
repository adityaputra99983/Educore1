import mongoose from 'mongoose';

// Ensure environment variables are loaded properly for Vercel
const MONGODB_URI = process.env.MONGODB_URI || '';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// Enhanced logging function for better observability
const logConnectionEvent = (event: string, details?: any) => {
    console.log(`[MongoDB] ${event}`, {
        timestamp: new Date().toISOString(),
        ...details
    });
};

// Improved error handling with structured error objects
class DatabaseConnectionError extends Error {
    constructor(message: string, public code?: string, public details?: any) {
        super(message);
        this.name = 'DatabaseConnectionError';
    }
}

async function dbConnect() {
    logConnectionEvent('Attempting database connection');
    
    // More descriptive error message for Vercel deployment
    if (!MONGODB_URI) {
        const error = new DatabaseConnectionError(
            'Missing MONGODB_URI environment variable',
            'MISSING_URI',
            {
                envVars: {
                    MONGODB_URI: process.env.MONGODB_URI ? '[SET]' : '[NOT SET]'
                },
                instructions: 'Define MONGODB_URI in .env.local for development or Vercel environment variables for production'
            }
        );
        logConnectionEvent('Connection failed - Missing URI', { error: error.message });
        throw error;
    }

    if (cached.conn) {
        logConnectionEvent('Using cached connection');
        return cached.conn;
    }

    if (!cached.promise) {
        logConnectionEvent('Creating new connection promise');
        
        // Enhanced options for better Vercel compatibility with detailed configuration
        const opts = {
            bufferCommands: false,
            // Connection timeout settings for serverless environments
            serverSelectionTimeoutMS: 10000, // Increased timeout for variable network conditions
            socketTimeoutMS: 45000,
            // Retry configuration for better reliability
            maxIdleTimeMS: 30000,
            connectTimeoutMS: 10000,
            // Connection pool settings optimized for serverless
            minPoolSize: 0, // Minimum number of sockets to keep open
            maxPoolSize: 10, // Maximum number of sockets to keep open
            retryWrites: true,
            // Additional options for better error handling
            appName: 'NOAH-Vercel-App'
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            logConnectionEvent('Connection established successfully');
            return mongoose;
        }).catch((error) => {
            logConnectionEvent('Connection attempt failed', { 
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            // Enhanced error handling with specific error types
            if (error instanceof mongoose.Error) {
                throw new DatabaseConnectionError(
                    `Mongoose error: ${error.message}`,
                    'MONGOOSE_ERROR',
                    { name: error.name, message: error.message }
                );
            } else if (error instanceof Error) {
                throw new DatabaseConnectionError(
                    `Connection error: ${error.message}`,
                    'CONNECTION_ERROR',
                    { name: error.name, message: error.message }
                );
            } else {
                throw new DatabaseConnectionError(
                    'Unknown connection error occurred',
                    'UNKNOWN_ERROR',
                    { originalError: error }
                );
            }
        });
    }

    try {
        cached.conn = await cached.promise;
        logConnectionEvent('Cached connection established');
    } catch (e) {
        cached.promise = null;
        logConnectionEvent('Connection failed', { 
            error: e instanceof Error ? e.message : 'Unknown error'
        });
        
        if (e instanceof DatabaseConnectionError) {
            throw e;
        }
        
        throw new DatabaseConnectionError(
            `Failed to connect to MongoDB: ${e instanceof Error ? e.message : 'Unknown error'}`,
            'CONNECTION_FAILED',
            { originalError: e }
        );
    }

    return cached.conn;
}

export default dbConnect;
