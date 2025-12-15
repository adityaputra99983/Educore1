// Test script to verify Simaka page can access database through API
const axios = require('axios');

async function testSimakaDbAccess() {
  console.log('Testing Simaka database access through API...');
  
  try {
    // Test getting students
    console.log('Testing GET /api/students');
    const studentsResponse = await axios.get('http://localhost:3000/api/students');
    console.log('Students API response status:', studentsResponse.status);
    console.log('Number of students:', studentsResponse.data.students?.length || 0);
    
    // Test getting reports
    console.log('Testing GET /api/reports?type=summary');
    const reportsResponse = await axios.get('http://localhost:3000/api/reports?type=summary');
    console.log('Reports API response status:', reportsResponse.status);
    console.log('Report success:', reportsResponse.data.success);
    
    // Test getting attendance
    console.log('Testing GET /api/attendance');
    const attendanceResponse = await axios.get('http://localhost:3000/api/attendance');
    console.log('Attendance API response status:', attendanceResponse.status);
    console.log('Attendance success:', attendanceResponse.data.success);
    
    console.log('All tests passed! Database connection is working properly.');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSimakaDbAccess();