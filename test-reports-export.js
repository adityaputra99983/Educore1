// Test script for reports export functionality
async function testReportsExport() {
  console.log('Testing reports export functionality...');
  
  try {
    // Test PDF export
    console.log('Testing PDF export...');
    const pdfResponse = await fetch('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'pdf',
        reportType: 'summary'
      })
    });
    
    const pdfData = await pdfResponse.json();
    console.log('PDF Export Response:', pdfData);
    
    // Test Excel export
    console.log('Testing Excel export...');
    const excelResponse = await fetch('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'excel',
        reportType: 'summary'
      })
    });
    
    const excelData = await excelResponse.json();
    console.log('Excel Export Response:', excelData);
    
    console.log('Reports export testing completed!');
  } catch (error) {
    console.error('Error testing reports export:', error);
  }
}

// Run the test
testReportsExport();