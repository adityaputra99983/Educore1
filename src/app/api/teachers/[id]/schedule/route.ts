import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Teacher from '../../../../../models/Teacher';

/**
 * GET /api/teachers/[id]/schedule
 * 
 * Retrieve a specific teacher's schedule.
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

    return NextResponse.json({
      success: true,
      schedule: teacher.schedule || []
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/teachers/[id]/schedule:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT /api/teachers/[id]/schedule
 * 
 * Update a teacher's schedule.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;

    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ success: false, error: 'Missing teacher ID' }, { status: 400 });
    }

    const teacherId = parseInt(resolvedParams.id, 10);
    if (isNaN(teacherId) || teacherId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid teacher ID: ' + resolvedParams.id }, { status: 400 });
    }

    const body = await request.json();
    const scheduleData = body.schedule || body; // Accept both formats

    if (!Array.isArray(scheduleData)) {
      return NextResponse.json({ success: false, error: 'Schedule data must be an array' }, { status: 400 });
    }

    // Ensure each schedule item has a unique ID
    const scheduleWithIds = scheduleData.map((item: { id?: number }, index: number) => ({
      ...item,
      id: item.id || Date.now() + index
    }));

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { id: teacherId },
      { schedule: scheduleWithIds },
      { new: true }
    );

    if (!updatedTeacher) {
      return NextResponse.json({ success: false, error: `Teacher with ID ${teacherId} not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      teacher: updatedTeacher
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in PUT /api/teachers/[id]/schedule:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}