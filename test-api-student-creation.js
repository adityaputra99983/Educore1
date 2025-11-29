// Test the exact student creation flow from the API route
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noah';

async function testStudentCreation() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');

    // Import the Student model after connecting to the database
    const Student = require('./src/models/Student').default;

    console.log('Creating test student...');
    
    // Generate new ID
    const lastStudent = await Student.findOne().sort({ id: -1 });
    const newId = lastStudent ? lastStudent.id + 1 : 1;

    const testStudent = new Student({
      id: newId,
      nis: 'TEST' + Date.now(),
      name: 'Test Student',
      class: 'X-A',
      status: 'belum-diisi',
      time: '-',
      photo: 'TS',
      attendance: 0,
      late: 0,
      absent: 0,
      permission: 0,
      type: 'new'
    });

    const savedStudent = await testStudent.save();
    console.log('Test student created:', savedStudent);

    // Clean up - delete the test student
    await Student.deleteOne({ id: newId });
    console.log('Test student cleaned up');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

testStudentCreation();