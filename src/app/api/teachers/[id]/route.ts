import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Teacher from '../../../../models/Teacher';

export const runtime = 'nodejs';

/**
 * GET /api/teachers/[id]
 * 
 * Retrieve a specific teacher by ID.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;

    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ success: false, error: 'Missing teacher ID' }, { status: 400 });
    }

    const teacherId = parseInt(resolvedParams.id, 10);
    if (isNaN(teacherId) || teacherId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid teacher ID' }, { status: 400 });
    }

    const teacher = await Teacher.findOne({ id: teacherId });

    if (!teacher) {
      return NextResponse.json({ success: false, error: `Teacher with ID ${teacherId} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, teacher }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in GET /api/teachers/[id]:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/teachers/[id]
 * 
 * Remove a teacher from the system.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;

    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ success: false, error: 'Missing teacher ID' }, { status: 400 });
    }

    const teacherId = parseInt(resolvedParams.id, 10);
    if (isNaN(teacherId) || teacherId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid teacher ID' }, { status: 400 });
    }

    const result = await Teacher.findOneAndDelete({ id: teacherId });

    if (!result) {
      return NextResponse.json({ success: false, error: `Teacher with ID ${teacherId} not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Teacher with ID ${teacherId} successfully removed`
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/teachers/[id]:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}