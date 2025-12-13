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

// GET /api/reports - Generate reports
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const period = searchParams.get('period') || 'daily';

    // Validate report type
    const validTypes = ['summary', 'performance', 'detailed', 'class', 'promotion', 'attendance'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid report type'
      }, { status: 400 });
    }

    const students = await Student.find({}).lean();
    const attendanceStats = await calculateAttendanceStats();
    const studentCategories = await calculateStudentCategories();

    // Generate different report types
    switch (type) {
      case 'summary':
        return NextResponse.json({
          success: true,
          reportType: 'summary',
          attendanceStats,
          studentCategories
        });

      case 'performance':
        // Calculate performance statistics
        const performanceData = {
          perfectAttendance: students.filter((s: any) => s.attendance === 100).length,
          highAttendance: students.filter((s: any) => s.attendance >= 90 && s.attendance < 100).length,
          mediumAttendance: students.filter((s: any) => s.attendance >= 75 && s.attendance < 90).length,
          lowAttendance: students.filter((s: any) => s.attendance < 75).length,
          mostLate: [...students].sort((a: any, b: any) => b.late - a.late).slice(0, 5),
          mostAbsent: [...students].sort((a: any, b: any) => b.absent - a.absent).slice(0, 5)
        };

        return NextResponse.json({
          success: true,
          reportType: 'performance',
          attendanceStats,
          performanceData
        });

      case 'detailed':
        // Enhanced detailed report with attendance and promotion data
        return NextResponse.json({
          success: true,
          reportType: 'detailed',
          students: students.map((student: any) => ({
            id: student.id,
            nis: student.nis,
            name: student.name,
            class: student.class,
            present: student.presentCount || 0,
            late: student.lateCount || 0,
            absent: student.absentCount || 0,
            permission: student.permissionCount || 0,
            totalAttendanceDays: student.totalAttendanceDays || 0,
            attendance: student.attendance,
            currentStatus: student.status,
            promotionStatus: student.promotionStatus || 'belum-ditetapkan',
            nextClass: student.nextClass || '-',
            currentTime: student.time
          })),
          attendanceStats
        });

      case 'class':
        // Enhanced class report with detailed statistics
        const classReports: Record<string, any> = {};
        students.forEach((student: any) => {
          if (!classReports[student.class]) {
            classReports[student.class] = {
              class: student.class,
              totalStudents: 0,
              present: 0,
              late: 0,
              absent: 0,
              permission: 0,
              averageAttendance: 0,
              promoted: 0,
              retained: 0,
              graduated: 0,
              attendanceSum: 0,
              totalPresent: 0,
              totalLate: 0,
              totalAbsent: 0,
              totalPermission: 0,
              totalAttendanceDays: 0
            };
          }

          classReports[student.class].totalStudents++;
          classReports[student.class].attendanceSum += student.attendance;
          classReports[student.class].totalPresent += student.presentCount || 0;
          classReports[student.class].totalLate += student.lateCount || 0;
          classReports[student.class].totalAbsent += student.absentCount || 0;
          classReports[student.class].totalPermission += student.permissionCount || 0;
          classReports[student.class].totalAttendanceDays += student.totalAttendanceDays || 0;

          switch (student.status) {
            case 'hadir':
              classReports[student.class].present++;
              break;
            case 'terlambat':
              classReports[student.class].late++;
              break;
            case 'tidak-hadir':
              classReports[student.class].absent++;
              break;
            case 'izin':
            case 'sakit':
              classReports[student.class].permission++;
              break;
          }

          // Count promotion statuses
          switch (student.promotionStatus) {
            case 'naik':
              classReports[student.class].promoted++;
              break;
            case 'tinggal':
              classReports[student.class].retained++;
              break;
            case 'lulus':
              classReports[student.class].graduated++;
              break;
          }
        });

        // Calculate average attendance rates for each class
        Object.values(classReports).forEach((classData: any) => {
          const total = classData.totalStudents;
          classData.averageAttendance = total > 0
            ? Math.round((classData.attendanceSum / total) * 10) / 10
            : 0;
        });

        return NextResponse.json({
          success: true,
          reportType: 'class',
          classReports: Object.values(classReports),
          attendanceStats
        });

      case 'promotion':
        // Enhanced promotion report with detailed statistics
        const promotionStats = {
          promoted: students.filter((s: any) => s.promotionStatus === 'naik').length,
          retained: students.filter((s: any) => s.promotionStatus === 'tinggal').length,
          graduated: students.filter((s: any) => s.promotionStatus === 'lulus').length,
          undecided: students.filter((s: any) => !s.promotionStatus || s.promotionStatus === 'belum-ditetapkan').length
        };

        // Detailed student stats for promotion
        const detailedStats = students.map((student: any) => ({
          id: student.id,
          nis: student.nis,
          name: student.name,
          class: student.class,
          currentStatus: student.status,
          promotionStatus: student.promotionStatus || 'belum-ditetapkan',
          nextClass: student.nextClass || '-',
          currentTime: student.time,
          attendancePercentage: student.attendance,
          presentCount: student.presentCount || 0,
          lateCount: student.lateCount || 0,
          absentCount: student.absentCount || 0,
          permissionCount: student.permissionCount || 0,
          totalAttendanceDays: student.totalAttendanceDays || 0
        }));

        return NextResponse.json({
          success: true,
          reportType: 'promotion',
          promotionStats,
          detailedStats,
          attendanceStats
        });

      case 'attendance':
        // Attendance-focused report with cumulative data
        return NextResponse.json({
          success: true,
          reportType: 'attendance',
          students: students.map((student: any) => ({
            id: student.id,
            nis: student.nis,
            name: student.name,
            class: student.class,
            present: student.presentCount || 0,
            late: student.lateCount || 0,
            absent: student.absentCount || 0,
            permission: student.permissionCount || 0,
            totalAttendanceDays: student.totalAttendanceDays || 0,
            attendance: student.attendance,
            currentStatus: student.status,
            promotionStatus: student.promotionStatus || 'belum-ditetapkan',
            currentTime: student.time
          })),
          attendanceStats
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid report type'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/reports - Export reports (PDF or Excel)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { format, reportType, data } = body;

    // Validate inputs
    if (!format || !['pdf', 'excel'].includes(format)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid format. Must be either "pdf" or "excel"'
      }, { status: 400 });
    }

    if (!reportType) {
      return NextResponse.json({
        success: false,
        error: 'Report type is required'
      }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({
        success: false,
        error: 'Report data is required'
      }, { status: 400 });
    }

    // Generate the appropriate export format
    if (format === 'pdf') {
      try {
        // Dynamically import pdfmake to avoid SSR issues
        const pdfMakeModule = await import('pdfmake/build/pdfmake');
        const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
        
        const pdfMake = pdfMakeModule.default;
        pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
        
        // Import the PDF generator function
        const { generatePDFReport } = await import('../../../utils/pdfGenerator');
        
        // Generate the PDF
        const blob = await generatePDFReport(data, reportType);
        
        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Set headers for PDF download - force download without print dialog
        const headers = new Headers();
        headers.append('Content-Type', 'application/pdf');
        headers.append('Content-Disposition', `attachment; filename=laporan-kehadiran-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', '0');
        
        // Return the PDF as a response
        return new NextResponse(buffer, { 
          status: 200, 
          headers 
        });
      } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
        return NextResponse.json({
          success: false,
          error: 'Failed to generate PDF report',
          message: pdfError instanceof Error ? pdfError.message : 'Unknown error'
        }, { status: 500 });
      }
    } else if (format === 'excel') {
      try {
        // Import the Excel generator function
        const { generateExcelReport } = await import('../../../utils/excelGenerator');
        
        // Generate the Excel file
        const blob = await generateExcelReport(data, reportType);
        
        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Set headers for Excel download - force download without print dialog
        const headers = new Headers();
        headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        headers.append('Content-Disposition', `attachment; filename=laporan-kehadiran-${reportType}-${new Date().toISOString().split('T')[0]}.xlsx`);
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', '0');
        
        // Return the Excel file as a response
        return new NextResponse(buffer, { 
          status: 200, 
          headers 
        });
      } catch (excelError) {
        console.error('Error generating Excel:', excelError);
        return NextResponse.json({
          success: false,
          error: 'Failed to generate Excel report',
          message: excelError instanceof Error ? excelError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Unsupported format'
    }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
