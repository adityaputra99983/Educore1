import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Student from '../../../../models/Student';

// GET /api/students/[id] - Get a specific student by ID with detailed information
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    const student = await Student.findOne({ id: studentId }).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Add detailed information to the student (Mock data for now as per original implementation)
    const studentWithDetails = {
      ...student,
      violations: student.violations || 0,
      achievements: student.achievements || 0,
      // Sample violations data
      recentViolations: [
        {
          id: 1,
          date: '2025-10-15',
          type: 'Keterlambatan',
          description: 'Terlambat masuk kelas lebih dari 15 menit',
          points: 2
        },
        {
          id: 2,
          date: '2025-09-22',
          type: 'Pelanggaran Seragam',
          description: 'Tidak memakai dasi sekolah',
          points: 1
        },
        {
          id: 3,
          date: '2025-08-05',
          type: 'Perilaku',
          description: 'Bertindak tidak sopan terhadap guru',
          points: 3
        }
      ].slice(0, student.violations || 0),
      // Sample achievements data
      recentAchievements: [
        {
          id: 1,
          date: '2025-10-05',
          type: 'Akademik',
          description: 'Peringkat 1 ujian matematika',
          points: 10
        },
        {
          id: 2,
          date: '2025-09-18',
          type: 'Olahraga',
          description: 'Juara 2 lomba renang antar kelas',
          points: 8
        },
        {
          id: 3,
          date: '2025-08-30',
          type: 'Sikap',
          description: 'Siswa teladan bulan Agustus',
          points: 5
        },
        {
          id: 4,
          date: '2025-07-15',
          type: 'Kesenian',
          description: 'Juara 1 lomba menyanyi tingkat sekolah',
          points: 7
        }
      ].slice(0, student.achievements || 0)
    };

    return NextResponse.json({ student: studentWithDetails });
  } catch (error) {
    console.error('Error in GET /api/students/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/students/[id] - Remove a student
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    const result = await Student.findOneAndDelete({ id: studentId });

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Student successfully removed'
    }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/students/[id]:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, { status: 500 });
  }
}