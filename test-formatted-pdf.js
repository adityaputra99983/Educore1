const fs = require('fs');
const path = require('path');

// Mock data for testing
const mockReportData = {
  reportType: 'summary',
  performanceData: undefined,
  attendanceStats: {
    totalStudents: 150,
    present: 120,
    late: 15,
    absent: 10,
    permission: 5,
    attendanceRate: 85.5
  },
  promotionStats: {
    promoted: 45,
    retained: 5,
    graduated: 30,
    undecided: 20
  },
  students: [
    { nis: '12345', name: 'Ahmad Rifai', class: 'XII-A', present: 28, late: 2, absent: 0, permission: 0, attendance: 93.33, promotionStatus: 'naik' },
    { nis: '12346', name: 'Budi Santoso', class: 'XII-B', present: 25, late: 3, absent: 2, permission: 0, attendance: 83.33, promotionStatus: 'tinggal' }
  ]
};

async function testFormattedPDF() {
  try {
    // Import the PDF generator
    const { generatePDFReport } = require('./src/utils/pdfGenerator');
    
    console.log('Generating formatted PDF report...');
    
    // Generate a summary report
    const pdfBlob = await generatePDFReport(mockReportData, 'summary');
    
    console.log('PDF generated successfully!');
    console.log('PDF size:', pdfBlob.size, 'bytes');
    
    // Save to file
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    const outputPath = path.join(__dirname, 'formatted-test-report.pdf');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('PDF saved to:', outputPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

testFormattedPDF();