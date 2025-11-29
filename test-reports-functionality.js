// Test file to verify reports functionality
const fs = require('fs');

// Simple test to verify the reports functionality
console.log('Testing reports functionality...');

// Check if required files exist
const requiredFiles = [
  './src/app/reports/page.tsx',
  './src/app/api/reports/route.ts',
  './src/utils/dataManager.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} does not exist`);
  }
});

console.log('Reports functionality test completed.');

const { DataManager } = require('./src/utils/dataManager');

// Test the reports functionality
async function testReports() {
  try {
    // Get data manager instance
    const dm = DataManager.getInstance();
    
    // Get all students
    const students = dm.getStudents();
    console.log('Total students:', students.length);
    
    // Calculate attendance stats
    const attendanceStats = dm.calculateAttendanceStats();
    console.log('Attendance stats:', attendanceStats);
    
    // Test different report types
    console.log('\n=== Summary Report ===');
    console.log('Students count:', students.length);
    console.log('Present:', attendanceStats.present);
    console.log('Late:', attendanceStats.late);
    console.log('Absent:', attendanceStats.absent);
    console.log('Permission:', attendanceStats.permission);
    
    console.log('\n=== Class-wise Report ===');
    // Group students by class
    const classStats = {};
    students.forEach(student => {
      if (!classStats[student.class]) {
        classStats[student.class] = {
          className: student.class,
          students: [],
          totalStudents: 0,
          present: 0,
          late: 0,
          absent: 0,
          permission: 0,
          attendanceRate: 0
        };
      }
      
      classStats[student.class].students.push(student);
      classStats[student.class].totalStudents++;
      
      // Update statistics based on current status
      switch (student.status) {
        case 'hadir':
          classStats[student.class].present++;
          break;
        case 'terlambat':
          classStats[student.class].late++;
          break;
        case 'tidak-hadir':
          classStats[student.class].absent++;
          break;
        case 'izin':
        case 'sakit':
          classStats[student.class].permission++;
          break;
      }
    });
    
    // Calculate attendance rates for each class
    Object.values(classStats).forEach(classData => {
      const total = classData.totalStudents;
      classData.attendanceRate = total > 0 
        ? Math.round(((classData.present + classData.late) / total) * 1000) / 10
        : 0;
    });
    
    console.log('Class stats:', classStats);
    
    console.log('\n=== Promotion Report ===');
    // Group students by promotion status
    const promotionStats = {
      naik: { count: 0, students: [] },
      tinggal: { count: 0, students: [] },
      lulus: { count: 0, students: [] },
      'belum-ditetapkan': { count: 0, students: [] }
    };
    
    students.forEach(student => {
      const status = student.promotionStatus || 'belum-ditetapkan';
      if (promotionStats[status]) {
        promotionStats[status].count++;
        promotionStats[status].students.push(student);
      }
    });
    
    console.log('Promotion stats:', promotionStats);
    
    console.log('\n=== Performance Report ===');
    // Calculate performance statistics
    const performanceData = {
      perfectAttendance: students.filter(s => s.attendance === 100).length,
      highAttendance: students.filter(s => s.attendance >= 90 && s.attendance < 100).length,
      mediumAttendance: students.filter(s => s.attendance >= 75 && s.attendance < 90).length,
      lowAttendance: students.filter(s => s.attendance < 75).length,
      mostLate: [...students].sort((a, b) => b.late - a.late).slice(0, 5),
      mostAbsent: [...students].sort((a, b) => b.absent - a.absent).slice(0, 5)
    };
    
    console.log('Performance data:', performanceData);
    
    console.log('\n=== Detailed Report ===');
    // Add status information to each student for the detailed report
    const detailedStudents = students.map(student => ({
      ...student,
      status: student.status || 'belum-hadir',
      time: student.time || '-'
    }));
    
    console.log('Detailed students count:', detailedStudents.length);
    
  } catch (error) {
    console.error('Error testing reports:', error);
  }
}

// Run the test
testReports();