// Test script to verify reports API connectivity
async function testReportsAPI() {
  console.log('Testing reports API connectivity...');
  
  try {
    // Test the summary report endpoint
    console.log('Testing /api/reports?type=summary...');
    const summaryResponse = await fetch('http://localhost:3000/api/reports?type=summary');
    const summaryData = await summaryResponse.json();
    
    if (summaryData.success) {
      console.log('✓ Summary report API working');
      console.log(`  Total students: ${summaryData.attendanceStats?.totalStudents}`);
      console.log(`  Present: ${summaryData.attendanceStats?.present}`);
      console.log(`  Attendance rate: ${summaryData.attendanceStats?.attendanceRate}%`);
    } else {
      console.log('✗ Summary report API failed:', summaryData.error);
    }
    
    // Test the promotion report endpoint
    console.log('\nTesting /api/reports?type=promotion...');
    const promotionResponse = await fetch('http://localhost:3000/api/reports?type=promotion');
    const promotionData = await promotionResponse.json();
    
    if (promotionData.success) {
      console.log('✓ Promotion report API working');
      console.log(`  Promoted students: ${promotionData.promotionStats?.promoted}`);
      console.log(`  Retained students: ${promotionData.promotionStats?.retained}`);
      console.log(`  Graduated students: ${promotionData.promotionStats?.graduated}`);
    } else {
      console.log('✗ Promotion report API failed:', promotionData.error);
    }
    
    // Test the class report endpoint
    console.log('\nTesting /api/reports?type=class...');
    const classResponse = await fetch('http://localhost:3000/api/reports?type=class');
    const classData = await classResponse.json();
    
    if (classData.success) {
      console.log('✓ Class report API working');
      console.log(`  Number of classes: ${classData.classReports?.length}`);
      if (classData.classReports && classData.classReports.length > 0) {
        const firstClass = classData.classReports[0];
        console.log(`  First class: ${firstClass.class} (${firstClass.totalStudents} students)`);
      }
    } else {
      console.log('✗ Class report API failed:', classData.error);
    }
    
    console.log('\nAPI connectivity test completed!');
    return true;
  } catch (error) {
    console.error('Error testing reports API:', error);
    return false;
  }
}

// Run the test
testReportsAPI()
  .then(success => {
    if (success) {
      console.log('\n✓ All API tests passed!');
    } else {
      console.log('\n✗ Some API tests failed!');
    }
  })
  .catch(error => {
    console.error('Test execution error:', error);
  });