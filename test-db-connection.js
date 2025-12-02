// Load environment variables from .env.local file
require('dotenv').config({ path: __dirname + '/.env.local' });

const mongoose = require('mongoose');

// Use the same MongoDB URI from the .env.local file with better fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noah';

console.log('=== Database Connection Test ===');
console.log('Current working directory:', __dirname);
console.log('MONGODB_URI from environment:', process.env.MONGODB_URI ? 'Loaded' : 'Not found');
console.log('Using URI (masked):', MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//****:****@'));

async function testConnection() {
  try {
    console.log('\nAttempting to connect to MongoDB...');
    
    // Standard connection options with timeouts for better error handling
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Try to access the database and list collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Close the connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('🔧 Error details:', {
      name: error.name,
      code: error.code,
      reason: error.reason
    });
    
    // Additional debugging for common issues
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI environment variable is not set in .env.local');
      console.warn('📝 Please check your .env.local file and ensure it contains a valid MongoDB connection string');
    }
    
    if (MONGODB_URI.includes('<')) {
      console.warn('⚠️  Your MongoDB URI still contains placeholder values (e.g., <username>, <password>)');
      console.warn('📝 Replace these with your actual MongoDB Atlas credentials');
    }
  }
}

testConnection();