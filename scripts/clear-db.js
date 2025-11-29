// Script to clear all data from MongoDB
// Run with: node scripts/clear-db.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in .env.local');
    process.exit(1);
}

async function clearDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        const db = mongoose.connection.db;

        // Get all collections
        const collections = await db.listCollections().toArray();
        console.log(`\nFound ${collections.length} collections`);

        // Delete all documents from each collection
        for (const collection of collections) {
            const collectionName = collection.name;
            const result = await db.collection(collectionName).deleteMany({});
            console.log(`✓ Cleared ${collectionName}: ${result.deletedCount} documents deleted`);
        }

        console.log('\n✅ Database cleared successfully!');

        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

clearDatabase();
