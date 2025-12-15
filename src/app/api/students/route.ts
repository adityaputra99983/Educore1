import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Student from '../../../models/Student';

export const runtime = 'nodejs';

// GET /api/students - Get all students with optional filtering
export async function GET(request: Request) {
  try {
    console.log('GET /api/students called');
    const db = await dbConnect();
    console.log('Database connected');
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const searchQuery = searchParams.get('search');
    const typeFilter = searchParams.get('type');
    const promotionStatusFilter = searchParams.get('promotionStatus');

    // Build query
    const query: Record<string, unknown> = {};

    if (classFilter && classFilter !== 'all') {
      query.class = classFilter;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { nis: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (typeFilter && typeFilter !== 'all') {
      const validTypes = ['existing', 'new', 'transfer'];
      if (!validTypes.includes(typeFilter)) {
        return NextResponse.json({ error: 'Invalid type filter' }, { status: 400 });
      }
      query.type = typeFilter;
    }

    if (promotionStatusFilter && promotionStatusFilter !== 'all') {
      const validStatuses = ['naik', 'tinggal', 'lulus', 'belum-ditetapkan'];
      if (!validStatuses.includes(promotionStatusFilter)) {
        return NextResponse.json({ error: 'Invalid promotion status filter' }, { status: 400 });
      }
      query.promotionStatus = promotionStatusFilter;
    }

    console.log('Query:', query);
    const students = await Student.find(query);
    console.log('Found students:', students.length);

    return NextResponse.json({ students });
  } catch (error: unknown) {
    console.error('Error in GET /api/students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/students - Add a new student
export async function POST(request: Request) {
  try {
    console.log('POST /api/students called');
    const db = await dbConnect();
    console.log('Database connected');
    
    // Log the raw request to see what we're getting
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    const bodyText = await request.text();
    console.log('Raw request body:', bodyText);
    
    // Parse the body
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(bodyText);
      console.log('Parsed body:', body);
    } catch (parseError: unknown) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body'
      }, { status: 400 });
    }

    // Validate required fields
    if (!body.nis || !body.name || !body.class) {
      console.log('Validation failed: required fields missing');
      return NextResponse.json({
        success: false,
        message: 'NIS, name, and class are required'
      }, { status: 400 });
    }

    // Validate student type if provided
    const validTypes = ['existing', 'new', 'transfer'];
    if (body.type && typeof body.type === 'string' && !validTypes.includes(body.type)) {
      console.log('Validation failed: invalid student type');
      return NextResponse.json({
        success: false,
        message: 'Invalid student type. Must be one of: existing, new, transfer'
      }, { status: 400 });
    }

    console.log('Finding last student');
    // Generate new ID
    const lastStudent = await Student.findOne().sort({ id: -1 });
    const newId = lastStudent ? lastStudent.id + 1 : 1;
    console.log('New ID:', newId);

    // Create photo initials from name
    const createPhotoInitials = (name: string): string => {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    };

    // Create new student object with all required fields
    const newStudentData = {
      id: newId,
      nis: body.nis as string,
      name: body.name as string,
      class: body.class as string,
      status: 'belum-diisi',
      time: '-',
      photo: createPhotoInitials(body.name as string),
      attendance: 0,
      late: 0,
      absent: 0,
      permission: 0,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      permissionCount: 0,
      totalAttendanceDays: 0,
      type: (body.type as string) || 'new',
      violations: 0,
      achievements: 0,
      promotionStatus: 'belum-ditetapkan',
      graduationStatus: 'belum-lulus'
    };
    
    console.log('Creating student with data:', newStudentData);
    
    const newStudent = new Student(newStudentData);
    const savedStudent = await newStudent.save();
    console.log('Student created successfully:', savedStudent);

    return NextResponse.json({ success: true, student: savedStudent }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error in POST /api/students:', error);
    // Return more detailed error information
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Internal Server Error', 
        message: error.message,
        stack: error.stack
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}