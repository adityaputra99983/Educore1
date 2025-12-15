import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { authenticateUser } from '../../../../utils/auth';

/**
 * POST /api/auth/login
 * 
 * Authenticate a user and return a JWT token
 */
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const result = await authenticateUser(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 401 }
      );
    }

    // Return token and user info
    return NextResponse.json({
      token: result.token,
      user: result.user
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}