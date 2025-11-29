require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  // Use environment variable or fallback to localhost
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const database = client.db('noah');
    const collections = await database.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

testConnection();