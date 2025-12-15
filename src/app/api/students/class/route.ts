import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Student from '../../../../models/Student';

export const runtime = 'nodejs';

// PUT /api/students/class - Update student's current class
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, class: newClass } = body;

    // Validate inputs
    if (!studentId || !newClass) {
      return NextResponse.json({ error: 'Student ID and class are required' }, { status: 400 });
    }

    const id = parseInt(studentId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Update student's class
    const student = await Student.findOneAndUpdate(
      { id: id },
      { class: newClass },
      { new: true }
    );

    if (student) {
      return NextResponse.json({ success: true, message: 'Student class updated successfully' });
    } else {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    console.error('Error in PUT /api/students/class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
