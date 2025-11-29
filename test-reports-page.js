// Test script to verify the reports page functionality
async function testReportsPage() {
  console.log('Testing reports page functionality...');
  
  try {
    // Test fetching different report types
    const reportTypes = ['summary', 'class', 'promotion', 'detailed', 'performance'];
    
    for (const type of reportTypes) {
      console.log(`Fetching ${type} report...`);
      const response = await fetch(`http://localhost:3000/api/reports?type=${type}`);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✓ ${type} report fetched successfully`);
      } else {
        console.log(`✗ Failed to fetch ${type} report: ${data.error}`);
      }
    }
    
    console.log('All reports tested!');
    return true;
  } catch (error) {
    console.error('Error testing reports page:', error);
    return false;
  }
}

// Run the test
testReportsPage()
  .then(success => {
    if (success) {
      console.log('Reports page test completed successfully');
    } else {
      console.log('Reports page test failed');
    }
  })
  .catch(console.error);