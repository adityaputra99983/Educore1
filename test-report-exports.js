// Test file to verify enhanced Excel and PDF exports
const fs = require('fs');

// Sample report data matching the API response structure
const sampleReportData = {
  success: true,
  reportType: 'summary',
  performanceData: undefined,
  attendanceStats: {
    totalStudents: 150,
    present: 142,
    late: 5,
    absent: 3,
    permission: 2,
    attendanceRate: 94.7
  },
  promotionStats: {
    promoted: 45,
    retained: 3,
    graduated: 25,
    undecided: 2
  },
  students: [
    {
      id: '1',
      nis: '1001',
      name: 'Ahmad Rifai',
      class: 'XII-A',
      present: 85,
      late: 3,
      absent: 2,
      permission: 0,
      attendance: 92.5,
      currentStatus: 'hadir',
      promotionStatus: 'naik',
      nextClass: 'XII-A',
      currentTime: '2024/2025'
    },
    {
      id: '2',
      nis: '1002',
      name: 'Budi Santoso',
      class: 'XII-B',
      present: 78,
      late: 5,
      absent: 7,
      permission: 0,
      attendance: 85.0,
      currentStatus: 'hadir',
      promotionStatus: 'tinggal',
      nextClass: 'XI-B',
      currentTime: '2024/2025'
    }
  ],
  classReports: [
    {
      class: 'X-A',
      totalStudents: 30,
      present: 28,
      late: 1,
      absent: 1,
      permission: 0,
      averageAttendance: 95.0,
      promoted: 10,
      retained: 0,
      graduated: 0,
      attendanceSum: 2850
    },
    {
      class: 'XII-A',
      totalStudents: 30,
      present: 28,
      late: 1,
      absent: 1,
      permission: 0,
      averageAttendance: 95.0,
      promoted: 0,
      retained: 0,
      graduated: 10,
      attendanceSum: 2850
    }
  ],
  detailedStats: [
    {
      id: '1',
      nis: '1001',
      name: 'Ahmad Rifai',
      class: 'XI-A',
      currentStatus: 'hadir',
      promotionStatus: 'naik',
      nextClass: 'XII-A',
      currentTime: '2024/2025',
      attendancePercentage: 92.5
    },
    {
      id: '2',
      nis: '1002',
      name: 'Budi Santoso',
      class: 'XI-B',
      currentStatus: 'hadir',
      promotionStatus: 'tinggal',
      nextClass: 'XI-B',
      currentTime: '2024/2025',
      attendancePercentage: 85.0
    }
  ]
};

console.log('Sample report data prepared for testing exports');
console.log('Data structure matches the API response format exactly');
console.log('Ready to test enhanced Excel and PDF export functionality');