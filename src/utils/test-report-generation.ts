// Test file for verifying enhanced report generation
import { generatePDFReport } from './pdfGenerator';
import { generateExcelReport } from './excelGenerator';

// Sample report data for testing
const sampleReportData = {
  reportType: 'summary',
  performanceData: undefined,
  reportTitle: 'Laporan Kehadiran dan Kenaikan Kelas',
  generatedAt: new Date().toISOString(),
  period: '2024/2025',
  totalStudents: 13,
  attendanceRate: 84.6,
  attendanceStats: {
    totalStudents: 13,
    present: 7,
    absent: 2,
    late: 3,
    permission: 4,
    attendanceRate: 84.6
  },
  promotionStats: {
    promoted: 8,
    retained: 2,
    graduated: 3,
    undecided: 0
  },
  students: [
    { 
      id: 1, 
      nis: '2024001', 
      name: 'Ahmad Fauzi', 
      class: 'XII-IPA-1', 
      status: 'hadir', 
      time: '07:15', 
      photo: 'AF', 
      attendance: 95, 
      late: 2, 
      absent: 1, 
      permission: 2, 
      type: 'existing', 
      violations: 1, 
      achievements: 3, 
      promotionStatus: 'lulus', 
      graduationStatus: 'lulus' 
    },
    { 
      id: 2, 
      nis: '2024002', 
      name: 'Siti Nurhaliza', 
      class: 'XII-IPA-1', 
      status: 'hadir', 
      time: '07:10', 
      photo: 'SN', 
      attendance: 98, 
      late: 1, 
      absent: 0, 
      permission: 1, 
      type: 'existing', 
      violations: 0, 
      achievements: 5, 
      promotionStatus: 'lulus', 
      graduationStatus: 'lulus' 
    }
  ],
  classReports: [
    {
      class: 'XII-IPA-1',
      totalStudents: 5,
      present: 3,
      late: 1,
      absent: 1,
      permission: 2,
      averageAttendance: 95.2,
      promoted: 3,
      retained: 1,
      graduated: 1,
      attendanceSum: 476
    }
  ],
  detailedStats: [
    { 
      id: 1, 
      nis: '2024001', 
      name: 'Ahmad Fauzi', 
      class: 'XII-IPA-1', 
      currentStatus: 'hadir', 
      promotionStatus: 'lulus', 
      nextClass: '-', 
      currentTime: '07:15', 
      attendancePercentage: 95 
    }
  ]
};

// Test PDF generation
async function testPDFGeneration() {
  console.log('Testing PDF generation...');
  
  try {
    // Test summary report
    const summaryPDF = await generatePDFReport(sampleReportData, 'summary');
    console.log('✓ Summary PDF generated successfully, size:', summaryPDF.size);
    
    // Test detailed report
    const detailedPDF = await generatePDFReport(sampleReportData, 'detailed');
    console.log('✓ Detailed PDF generated successfully, size:', detailedPDF.size);
    
    // Test class report
    const classPDF = await generatePDFReport(sampleReportData, 'class');
    console.log('✓ Class PDF generated successfully, size:', classPDF.size);
    
    // Test promotion report
    const promotionPDF = await generatePDFReport(sampleReportData, 'promotion');
    console.log('✓ Promotion PDF generated successfully, size:', promotionPDF.size);
    
    console.log('All PDF tests passed!');
  } catch (error) {
    console.error('Error in PDF generation tests:', error);
  }
}

// Test Excel generation
async function testExcelGeneration() {
  console.log('Testing Excel generation...');
  
  try {
    // Test summary report
    const summaryExcel = await generateExcelReport(sampleReportData, 'summary');
    console.log('✓ Summary Excel generated successfully, size:', summaryExcel.size);
    
    // Test detailed report
    const detailedExcel = await generateExcelReport(sampleReportData, 'detailed');
    console.log('✓ Detailed Excel generated successfully, size:', detailedExcel.size);
    
    // Test class report
    const classExcel = await generateExcelReport(sampleReportData, 'class');
    console.log('✓ Class Excel generated successfully, size:', classExcel.size);
    
    // Test promotion report
    const promotionExcel = await generateExcelReport(sampleReportData, 'promotion');
    console.log('✓ Promotion Excel generated successfully, size:', promotionExcel.size);
    
    console.log('All Excel tests passed!');
  } catch (error) {
    console.error('Error in Excel generation tests:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting report generation tests...\n');
  
  await testPDFGeneration();
  console.log(''); // Empty line for spacing
  
  await testExcelGeneration();
  
  console.log('\nAll tests completed!');
}

// Export for use in other files
export { testPDFGeneration, testExcelGeneration, runTests };