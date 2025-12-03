
/**
 * Test script to verify attendance tracking functionality
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testAttendanceTracking() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(); // Uses database name from URI
    const studentsCollection = database.collection('students');

    // Find a sample student to test
    const student = await studentsCollection.findOne({});
    
    if (!student) {
      console.log('No students found in database');
      return;
    }

    console.log('Testing student:', student.name);
    console.log('Current attendance data:');
    console.log('- Status:', student.status);
    console.log('- Attendance percentage:', student.attendance);
    console.log('- Late count:', student.late);
    console.log('- Absent count:', student.absent);
    console.log('- Permission count:', student.permission);
    console.log('- Cumulative counts:');
    console.log('  - Present count:', student.presentCount);
    console.log('  - Late count:', student.lateCount);
    console.log('  - Absent count:', student.absentCount);
    console.log('  - Permission count:', student.permissionCount);
    console.log('  - Total attendance days:', student.totalAttendanceDays);

    // Simulate an attendance update
    console.log('\nSimulating attendance update...');
    
    // Get current values
    const currentPresentCount = student.presentCount || 0;
    const currentLateCount = student.lateCount || 0;
    const currentAbsentCount = student.absentCount || 0;
    const currentPermissionCount = student.permissionCount || 0;
    const currentTotalDays = student.totalAttendanceDays || 0;
    
    // Simulate marking student as present
    const newStatus = 'hadir';
    const newPresentCount = currentPresentCount + 1;
    const newTotalDays = currentTotalDays + 1;
    
    // Calculate new attendance percentage
    const totalRecordedDays = newPresentCount + currentLateCount + currentAbsentCount + currentPermissionCount;
    const presentDays = newPresentCount + currentLateCount; // Present includes on-time and late
    const newAttendance = totalRecordedDays > 0 
      ? Math.max(0, Math.min(100, Math.round((presentDays / totalRecordedDays) * 100)))
      : 0;
    
    console.log('New values after marking as present:');
    console.log('- New present count:', newPresentCount);
    console.log('- New total attendance days:', newTotalDays);
    console.log('- New attendance percentage:', newAttendance);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error testing attendance tracking:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  testAttendanceTracking().catch(console.error);
}


/**
 * Test script to verify attendance tracking functionality
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testAttendanceTracking() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(); // Uses database name from URI
    const studentsCollection = database.collection('students');

    // Find a sample student to test
    const student = await studentsCollection.findOne({});
    
    if (!student) {
      console.log('No students found in database');
      return;
    }

    console.log('Testing student:', student.name);
    console.log('Current attendance data:');
    console.log('- Status:', student.status);
    console.log('- Attendance percentage:', student.attendance);
    console.log('- Late count:', student.late);
    console.log('- Absent count:', student.absent);
    console.log('- Permission count:', student.permission);
    console.log('- Cumulative counts:');
    console.log('  - Present count:', student.presentCount);
    console.log('  - Late count:', student.lateCount);
    console.log('  - Absent count:', student.absentCount);
    console.log('  - Permission count:', student.permissionCount);
    console.log('  - Total attendance days:', student.totalAttendanceDays);

    // Simulate an attendance update
    console.log('\nSimulating attendance update...');
    
    // Get current values
    const currentPresentCount = student.presentCount || 0;
    const currentLateCount = student.lateCount || 0;
    const currentAbsentCount = student.absentCount || 0;
    const currentPermissionCount = student.permissionCount || 0;
    const currentTotalDays = student.totalAttendanceDays || 0;
    
    // Simulate marking student as present
    const newStatus = 'hadir';
    const newPresentCount = currentPresentCount + 1;
    const newTotalDays = currentTotalDays + 1;
    
    // Calculate new attendance percentage
    const totalRecordedDays = newPresentCount + currentLateCount + currentAbsentCount + currentPermissionCount;
    const presentDays = newPresentCount + currentLateCount; // Present includes on-time and late
    const newAttendance = totalRecordedDays > 0 
      ? Math.max(0, Math.min(100, Math.round((presentDays / totalRecordedDays) * 100)))
      : 0;
    
    console.log('New values after marking as present:');
    console.log('- New present count:', newPresentCount);
    console.log('- New total attendance days:', newTotalDays);
    console.log('- New attendance percentage:', newAttendance);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error testing attendance tracking:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  testAttendanceTracking().catch(console.error);
}