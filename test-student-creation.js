require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noah';

async function testStudentCreation() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Import model after connection
    const Student = require('./src/models/Student').default;

    console.log('Testing student creation...');

    // Get the highest current ID
    const lastStudent = await Student.findOne().sort({ id: -1 });
    const newId = lastStudent ? lastStudent.id + 1 : 1;

    // Create a test student
    const student = new Student({
      id: newId,
      nis: 'TEST' + Date.now(),
      name: 'Test Student',
      class: 'XII-IPA-1',
      status: 'belum-diisi',
      time: '-',
      photo: 'TS',
      attendance: 0,
      late: 0,
      absent: 0,
      permission: 0,
      type: 'new'
    });

    const savedStudent = await student.save();
    console.log('Student created successfully:', savedStudent.name);

    // Clean up
    await Student.deleteOne({ id: newId });
    console.log('Test student removed');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

testStudentCreation();