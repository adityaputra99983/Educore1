import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Teacher from '../../../models/Teacher';

/**
 * GET /api/teachers
 * 
 * Retrieve all teachers along with their schedules.
 */
export async function GET() {
  try {
    await dbConnect();
    const teachers = await Teacher.find({});

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error('Error in GET /api/teachers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/teachers
 * 
 * Add a new teacher to the system.
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Generate new ID
    const lastTeacher = await Teacher.findOne().sort({ id: -1 });
    const newId = lastTeacher ? lastTeacher.id + 1 : 1;

    const newTeacherData = {
      id: newId,
      name: body.name,
      subject: body.subject,
      photo: body.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      schedule: body.schedule || []
    };

    const newTeacher = await Teacher.create(newTeacherData);

    return NextResponse.json({ success: true, teacher: newTeacher }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teachers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}