import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Settings from '../../../models/Settings';

export const runtime = 'nodejs';

// GET /api/settings - Get system settings
export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();

    if (!settings) {
      // Create default settings if not exists
      settings = await Settings.create({});
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/settings - Update system settings
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Update settings (upsert)
    // We assume there's only one settings document
    const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error: unknown) {
    console.error('Error in PUT /api/settings:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}