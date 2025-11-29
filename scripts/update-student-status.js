// Script to update existing students' status from 'hadir' to 'belum-diisi'
// for students who haven't actually had their attendance recorded
// Run with: node scripts/update-student-status.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Student schema matching the TypeScript model
const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nis: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  status: {
    type: String,
    enum: ['hadir', 'terlambat', 'tidak-hadir', 'izin', 'sakit', 'belum-diisi'],
    default: 'belum-diisi'
  },
  time: { type: String, default: '-' },
  photo: { type: String, default: '' },
  attendance: { type: Number, default: 0 },
  late: { type: Number, default: 0 },
  absent: { type: Number, default: 0 },
  permission: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ['existing', 'new', 'transfer'],
    default: 'existing'
  },
  violations: { type: Number, default: 0 },
  achievements: { type: Number, default: 0 },
  promotionStatus: {
    type: String,
    enum: ['naik', 'tinggal', 'lulus', 'belum-ditetapkan'],
    default: 'belum-ditetapkan'
  },
  graduationStatus: {
    type: String,
    enum: ['lulus', 'belum-lulus'],
    default: 'belum-lulus'
  },
  previousClass: { type: String },
  nextClass: { type: String }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

async function updateStudentStatus() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Find students with status 'hadir' and time '-' (meaning attendance hasn't been recorded)
    const studentsToUpdate = await Student.find({ 
      status: 'hadir',
      time: '-'
    });

    console.log(`Found ${studentsToUpdate.length} students with unrecorded attendance`);

    if (studentsToUpdate.length > 0) {
      // Update each student
      for (const student of studentsToUpdate) {
        console.log(`Updating student ${student.name} (${student.nis}) from 'hadir' to 'belum-diisi'`);
        
        await Student.updateOne(
          { _id: student._id },
          { 
            status: 'belum-diisi',
            attendance: 0
          }
        );
      }
      
      console.log(`\n✅ Successfully updated ${studentsToUpdate.length} students`);
    } else {
      console.log('No students need to be updated');
    }

    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating student status:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateStudentStatus();