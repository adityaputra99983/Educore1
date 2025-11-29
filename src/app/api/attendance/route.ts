import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Student, { type IStudent } from '../../../models/Student';

// Helper function to calculate stats
async function calculateAttendanceStats() {
  const totalStudents = await Student.countDocuments();
  const present = await Student.countDocuments({ status: 'hadir' });
  const late = await Student.countDocuments({ status: 'terlambat' });
  const absent = await Student.countDocuments({ status: 'tidak-hadir' });
  const permission = await Student.countDocuments({ status: { $in: ['izin', 'sakit'] } });

  const attendanceRate = totalStudents > 0
    ? Math.round(((present + late) / totalStudents) * 1000) / 10
    : 0;

  return {
    totalStudents,
    present,
    absent,
    late,
    permission,
    attendanceRate
  };
}

// Helper function to calculate student categories
async function calculateStudentCategories() {
  const totalStudents = await Student.countDocuments();
  const newStudents = await Student.countDocuments({ type: 'new' });
  const transferStudents = await Student.countDocuments({ type: 'transfer' });
  const existingStudents = await Student.countDocuments({ type: 'existing' });

  return {
    totalStudents,
    newStudents,
    transferStudents,
    existingStudents
  };
}

// GET /api/attendance - Get attendance records with optional filtering
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const classFilter = searchParams.get('class');
    const searchQuery = searchParams.get('search');

    // Validate class filter if provided
    if (classFilter && classFilter !== 'all') {
      if (typeof classFilter !== 'string' || classFilter.trim() === '') {
        return NextResponse.json({
          success: false,
          message: 'Invalid class filter'
        }, { status: 400 });
      }
    }

    // Validate search query if provided
    if (searchQuery && typeof searchQuery !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid search query'
      }, { status: 400 });
    }

    // Build query
    const query: any = {};

    if (classFilter && classFilter !== 'all') {
      query.class = classFilter;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { nis: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const filteredStudents = await Student.find(query);

    // Calculate stats
    const stats = await calculateAttendanceStats();

    return NextResponse.json({
      success: true,
      date,
      records: filteredStudents,
      stats
    });
  } catch (error) {
    console.error('Error in GET /api/attendance:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT /api/attendance - Update attendance status for a student
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, newStatus } = body;

    // Validate input
    if (!studentId || !newStatus) {
      return NextResponse.json({
        success: false,
        message: 'Student ID and new status are required'
      }, { status: 400 });
    }

    // Validate student ID
    const id = parseInt(studentId as string, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid student ID. Must be a positive number.'
      }, { status: 400 });
    }

    // Validate status values
    const validStatuses = ['hadir', 'terlambat', 'tidak-hadir', 'izin', 'sakit'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status value. Must be one of: hadir, terlambat, tidak-hadir, izin, sakit'
      }, { status: 400 });
    }

    // Update student status
    const currentTime = newStatus === 'hadir' || newStatus === 'terlambat'
      ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : '-';

    // We need to update stats (attendance count, late count, etc.)
    // This logic was complex in DataManager.
    // Ideally we should have a separate Attendance model to track daily attendance.
    // But for now, we are updating the Student model's current status and aggregate stats.

    const student = await Student.findOne({ id: id });
    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    let updatedLate = student.late || 0;
    let updatedAbsent = student.absent || 0;
    let updatedPermission = student.permission || 0;

    // Decrease previous status count (but not for 'belum-diisi')
    if (student.status !== 'belum-diisi') {
      switch (student.status) {
        case 'terlambat':
          updatedLate = Math.max(0, updatedLate - 1);
          break;
        case 'tidak-hadir':
          updatedAbsent = Math.max(0, updatedAbsent - 1);
          break;
        case 'izin':
        case 'sakit':
          updatedPermission = Math.max(0, updatedPermission - 1);
          break;
      }
    }

    // Increase new status count
    switch (newStatus) {
      case 'terlambat':
        updatedLate = updatedLate + 1;
        break;
      case 'tidak-hadir':
        updatedAbsent = updatedAbsent + 1;
        break;
      case 'izin':
      case 'sakit':
        updatedPermission = updatedPermission + 1;
        break;
    }

    const totalDays = 100; // Fixed total as per original code
    const presentDays = totalDays - updatedAbsent - updatedPermission;
    const updatedAttendance = Math.max(0, Math.min(100, Math.round((presentDays / totalDays) * 100)));

    const updatedStudent = await Student.findOneAndUpdate(
      { id: id },
      {
        status: newStatus,
        time: currentTime,
        attendance: updatedAttendance,
        late: updatedLate,
        absent: updatedAbsent,
        permission: updatedPermission
      },
      { new: true }
    );

    // Get updated stats
    const updatedStats = await calculateAttendanceStats();
    const studentCategories = await calculateStudentCategories();

    // Return success response with all necessary data
    const response = {
      success: true,
      message: 'Attendance status updated successfully',
      student: updatedStudent,
      stats: updatedStats,
      categories: studentCategories
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}