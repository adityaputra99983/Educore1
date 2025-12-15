import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../utils/auth';

/**
 * POST /api/auth/verify
 * 
 * Verify a JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Validate input
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Return decoded token info
    return NextResponse.json({
      valid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/auth/verify:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}