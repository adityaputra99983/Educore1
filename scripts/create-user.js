const path = require('path');
// Add the noah directory to the module search path
module.paths.push(path.resolve(__dirname, '..', 'node_modules'));

const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

// Import models with adjusted paths
const User = require('../src/models/User').default;
const dbConnect = require('../src/lib/db').default;

async function createUser() {
  try {
    console.log('Creating users...');
    
    // Connect to database
    await dbConnect();
    console.log('Connected to database');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@namira.sch.id' });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@namira.sch.id',
      password: 'SecurePass123!',
      role: 'admin',
      name: 'Administrator'
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    // Create teacher user
    const teacherUser = new User({
      email: 'teacher@namira.sch.id',
      password: 'TeacherPass123!',
      role: 'teacher',
      name: 'Guru Mata Pelajaran'
    });

    await teacherUser.save();
    console.log('Teacher user created successfully');

    console.log('\nLogin Credentials:');
    console.log('Admin: admin@namira.sch.id / SecurePass123!');
    console.log('Teacher: teacher@namira.sch.id / TeacherPass123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
}

createUser();