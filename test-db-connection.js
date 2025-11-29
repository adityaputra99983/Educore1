require('dotenv').config({ path: __dirname + '/.env.local' });
const mongoose = require('mongoose');

// Use the same MongoDB URI from the .env.local file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noah';

console.log('Current working directory:', __dirname);
console.log('MONGODB_URI from environment:', process.env.MONGODB_URI);

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//****:****@')); // Hide credentials in log
    
    // Standard connection options
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('Successfully connected to MongoDB!');
    
    // Try to access the students collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();