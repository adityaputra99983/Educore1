require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noah';

async function debugStudentCreation() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGODB_URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Import model after connection
    const Student = require('./models/Student').default;

    console.log('Testing student creation...');

    // Get the highest current ID
    console.log('Finding last student...');
    const lastStudent = await Student.findOne().sort({ id: -1 });
    console.log('Last student:', lastStudent ? lastStudent.id : 'None found');
    const newId = lastStudent ? lastStudent.id + 1 : 1;
    console.log('New ID:', newId);

    // Create a test student
    console.log('Creating student object...');
    const studentData = {
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
    };
    
    console.log('Student data:', studentData);

    const student = new Student(studentData);
    console.log('Student object created');

    const savedStudent = await student.save();
    console.log('Student created successfully:', savedStudent.name);

    // Clean up
    await Student.deleteOne({ id: newId });
    console.log('Test student removed');

    mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

debugStudentCreation();