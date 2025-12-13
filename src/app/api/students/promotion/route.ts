import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Student from '../../../../models/Student';

// PUT /api/students/promotion - Update student promotion/graduation status
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, promotionStatus, nextClass } = body;

    // Validate inputs
    if (!studentId || !promotionStatus) {
      return NextResponse.json({
        success: false,
        error: 'Student ID and promotion status are required'
      }, { status: 400 });
    }

    // Validate student ID
    const id = parseInt(studentId as string, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid student ID. Must be a positive number.'
      }, { status: 400 });
    }

    // Validate promotion status value
    const validStatuses = ['naik', 'tinggal', 'lulus', 'belum-ditetapkan'];
    if (!validStatuses.includes(promotionStatus)) {
      return NextResponse.json({
        success: false,
        error: `Invalid promotion status. Must be one of: ${validStatuses.join(', ')}`
      }, { status: 400 });
    }

    // Validate nextClass if provided
    if (nextClass && typeof nextClass !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Next class must be a string.'
      }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      promotionStatus,
      // We need to fetch the student first to know the current class for previousClass, 
      // or we can just use aggregation pipeline update if we want to be atomic, 
      // but simple findOneAndUpdate is easier.
    };

    if (promotionStatus === 'lulus') {
      updateData.graduationStatus = 'lulus';
    }

    // We need to set previousClass = current class, and nextClass = nextClass || current class
    // This logic was in DataManager. Let's replicate it.
    const student = await Student.findOne({ id: id });
    if (!student) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    updateData.previousClass = student.class;
    updateData.nextClass = nextClass || student.class;

    const updatedStudent = await Student.findOneAndUpdate(
      { id: id },
      updateData,
      { new: true }
    );

    if (updatedStudent) {
      return NextResponse.json({
        success: true,
        message: 'Student promotion status updated successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }
  } catch (error: unknown) {
    console.error('Error in PUT /api/students/promotion:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
