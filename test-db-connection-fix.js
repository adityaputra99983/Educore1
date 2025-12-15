// Test script to verify database connection is working properly
const { exec } = require('child_process');

console.log('Testing database connection...');

// Run the existing test script
exec('node test-db-connection.js', (error, stdout, stderr) => {
  if (error) {
    console.log('Error running test-db-connection.js:');
    console.log(error);
    return;
  }
  
  console.log('Output from test-db-connection.js:');
  console.log(stdout);
  
  if (stderr) {
    console.log('Stderr from test-db-connection.js:');
    console.log(stderr);
  }
});

// Also run a simple API test
exec('node test-api.js', (error, stdout, stderr) => {
  if (error) {
    console.log('Error running test-api.js:');
    console.log(error);
    return;
  }
  
  console.log('Output from test-api.js:');
  console.log(stdout);
  
  if (stderr) {
    console.log('Stderr from test-api.js:');
    console.log(stderr);
  }
});