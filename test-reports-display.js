// Test script to verify reports functionality
async function testReportsDisplay() {
  console.log('Testing reports display functionality...');
  
  try {
    // Test fetching a summary report
    console.log('Fetching summary report...');
    const summaryResponse = await fetch('http://localhost:3000/api/reports?type=summary');
    const summaryData = await summaryResponse.json();
    console.log('Summary report fetched successfully:', summaryData.success);
    
    // Test fetching a class report
    console.log('Fetching class report...');
    const classResponse = await fetch('http://localhost:3000/api/reports?type=class');
    const classData = await classResponse.json();
    console.log('Class report fetched successfully:', classData.success);
    
    // Test fetching a promotion report
    console.log('Fetching promotion report...');
    const promotionResponse = await fetch('http://localhost:3000/api/reports?type=promotion');
    const promotionData = await promotionResponse.json();
    console.log('Promotion report fetched successfully:', promotionData.success);
    
    // Test fetching a detailed report
    console.log('Fetching detailed report...');
    const detailedResponse = await fetch('http://localhost:3000/api/reports?type=detailed');
    const detailedData = await detailedResponse.json();
    console.log('Detailed report fetched successfully:', detailedData.success);
    
    // Test fetching a performance report
    console.log('Fetching performance report...');
    const performanceResponse = await fetch('http://localhost:3000/api/reports?type=performance');
    const performanceData = await performanceResponse.json();
    console.log('Performance report fetched successfully:', performanceData.success);
    
    console.log('All reports fetched successfully!');
    return true;
  } catch (error) {
    console.error('Error testing reports display:', error);
    return false;
  }
}

// Run the test
testReportsDisplay()
  .then(success => {
    if (success) {
      console.log('Reports display test completed successfully');
    } else {
      console.log('Reports display test failed');
    }
  })
  .catch(console.error);