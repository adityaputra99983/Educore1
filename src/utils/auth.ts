import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import User from '../models/User';

// Secret key for JWT signing (should be stored in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'noah-school-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JwtPayload): string {
  // Ensure we have a valid secret
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    // Ensure we have a valid secret
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  await dbConnect();
  
  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }
  
  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return { success: false, message: 'Invalid credentials' };
  }
  
  // Generate token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });
  
  return { 
    success: true, 
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

/**
 * Middleware to protect API routes
 */
export async function protectRoute(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' }, 
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' }, 
      { status: 401 }
    );
  }
  
  // Add user info to request context
  (request as any).user = decoded;
  return null; // Indicates successful authentication
}