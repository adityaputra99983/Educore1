/**
 * Script to initialize cumulative attendance counts for existing students
 * This script should be run once to populate the new attendance tracking fields
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function initializeAttendanceCounts() {
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

    // Find all students
    const students = await studentsCollection.find({}).toArray();
    console.log(`Found ${students.length} students`);

    let updatedCount = 0;

    // Process each student
    for (const student of students) {
      // Skip if already initialized
      if (typeof student.presentCount !== 'undefined') {
        console.log(`Student ${student.nis} already initialized, skipping`);
        continue;
      }

      // Initialize cumulative attendance fields
      const updateFields = {
        presentCount: student.presentCount || 0,
        lateCount: student.lateCount || 0,
        absentCount: student.absentCount || 0,
        permissionCount: student.permissionCount || 0,
        totalAttendanceDays: student.totalAttendanceDays || 0
      };

      // If student has attendance data, we can estimate initial values
      // This is a rough estimation - in a real scenario, you might want to import historical data
      if (student.attendance && student.attendance > 0) {
        // Estimate based on current attendance percentage
        // Assume 100 total days for calculation
        const totalDays = 100;
        const presentDays = Math.round((student.attendance / 100) * totalDays);
        
        // Distribute present days between present and late (assume 10% late)
        const lateDays = Math.round(presentDays * 0.1);
        const actualPresentDays = presentDays - lateDays;
        
        // Absent and permission days
        const absentDays = Math.round((student.absent || 0) * 10); // Scale up from current values
        const permissionDays = Math.round((student.permission || 0) * 10); // Scale up from current values
        
        updateFields.presentCount = actualPresentDays;
        updateFields.lateCount = lateDays;
        updateFields.absentCount = absentDays;
        updateFields.permissionCount = permissionDays;
        updateFields.totalAttendanceDays = actualPresentDays + lateDays + absentDays + permissionDays;
      }

      // Update the student record
      const result = await studentsCollection.updateOne(
        { _id: student._id },
        { $set: updateFields }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`Updated student ${student.nis} (${student.name}) with attendance counts`);
      }
    }

    console.log(`Successfully updated ${updatedCount} students with attendance counts`);
  } catch (error) {
    console.error('Error initializing attendance counts:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  initializeAttendanceCounts().catch(console.error);
}

module.exports = { initializeAttendanceCounts };