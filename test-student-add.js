// Simple test to verify student creation works
const { exec } = require('child_process');

console.log('Testing student creation through API...');

// Test by making a direct API call to add a student
const testData = {
  nis: 'TEST' + Date.now(),
  name: 'Test Student',
  class: 'XII-IPA-1',
  type: 'new'
};

console.log('Test data:', testData);

// We'll use curl to test the API endpoint
const curlCommand = `curl -X POST http://localhost:3000/api/students -H "Content-Type: application/json" -d '${JSON.stringify(testData)}'`;

console.log('Running command:', curlCommand);

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.log('Error making API call:');
    console.log(error);
    return;
  }
  
  console.log('API Response:');
  console.log(stdout);
  
  if (stderr) {
    console.log('Stderr:');
    console.log(stderr);
  }
});