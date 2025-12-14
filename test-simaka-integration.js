
/**
 * Script to test SIMAKA API integration
 * Run with: node test-simaka-integration.js
 */

async function testAPIEndpoint(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`Testing ${method} ${url}...`);
    const response = await fetch(`http://localhost:3000${url}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${url} - Status: ${response.status}`);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`❌ ${method} ${url} - Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runIntegrationTests() {
  console.log('🧪 Starting SIMAKA API Integration Tests...\n');
  
  // Test health check
  await testAPIEndpoint('/api/health-check');
  
  // Test settings
  await testAPIEndpoint('/api/settings');
  
  // Test students
  await testAPIEndpoint('/api/students');
  
  // Test attendance
  await testAPIEndpoint('/api/attendance');
  
  // Test reports
  await testAPIEndpoint('/api/reports?type=summary');
  
  // Test teachers
  await testAPIEndpoint('/api/teachers');
  
  // Test our integration endpoint
  await testAPIEndpoint('/api/integration-test');
  
  console.log('\n🏁 Integration tests completed!');
  console.log('📝 Note: Make sure the development server is running on port 3000');
  console.log('   Start it with: npm run dev');
}

// Run the tests

/**
 * Script to test SIMAKA API integration
 * Run with: node test-simaka-integration.js
 */

async function testAPIEndpoint(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`Testing ${method} ${url}...`);
    const response = await fetch(`http://localhost:3000${url}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${url} - Status: ${response.status}`);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`❌ ${method} ${url} - Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runIntegrationTests() {
  console.log('🧪 Starting SIMAKA API Integration Tests...\n');
  
  // Test health check
  await testAPIEndpoint('/api/health-check');
  
  // Test settings
  await testAPIEndpoint('/api/settings');
  
  // Test students
  await testAPIEndpoint('/api/students');
  
  // Test attendance
  await testAPIEndpoint('/api/attendance');
  
  // Test reports
  await testAPIEndpoint('/api/reports?type=summary');
  
  // Test teachers
  await testAPIEndpoint('/api/teachers');
  
  // Test our integration endpoint
  await testAPIEndpoint('/api/integration-test');
  
  console.log('\n🏁 Integration tests completed!');
  console.log('📝 Note: Make sure the development server is running on port 3000');
  console.log('   Start it with: npm run dev');
}

