/**
 * Test script for enhanced MongoDB connection handling
 * This script verifies the improved error handling, logging, and connection management
 */

require('dotenv').config({ path: '.env.local' });

async function testEnhancedConnection() {
  console.log('=== Enhanced Database Connection Test ===');
  
  try {
    console.log('Attempting to connect to MongoDB with enhanced handling...');
    
    // Dynamically import the TypeScript module
    const dbModule = await import('./src/lib/db');
    const dbConnect = dbModule.default;
    
    // Test the enhanced connection
    const connection = await dbConnect();
    
    console.log('✅ Enhanced connection successful!');
    console.log(`📚 Connection state: ${connection.connection.readyState}`);
    console.log(`📍 Host: ${connection.connection.host}`);
    console.log(`📦 Database: ${connection.connection.name}`);
    
    // Note: We won't disconnect here to avoid interfering with other processes
    console.log('ℹ️  Keeping connection open for other processes');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error(`   Name: ${error.name}`);
    console.error(`   Message: ${error.message}`);
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    if (error.details) {
      console.error(`   Details: ${JSON.stringify(error.details, null, 2)}`);
    }
  }
}

// Run the test
testEnhancedConnection().catch(console.error);