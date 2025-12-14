const { generateExcelReport } = require('./src/utils/excelGenerator');

// Test data matching the UI
const testData = {
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
  }
};

// Test the Excel generation
generateExcelReport(testData, 'summary')
  .then(blob => {
    console.log('Excel report generated successfully!');
    console.log('Blob size:', blob.size);
  })
  .catch(error => {
    console.error('Error generating Excel report:', error);
  });