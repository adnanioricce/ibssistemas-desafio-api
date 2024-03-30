// seed-db.js

const { MongoClient } = require('mongodb');
const fs = require('fs')
// Connection URI
const uri = 'mongodb://root:passwd@localhost:8082/';

// Database Name
const dbName = 'persons';
const json = fs.readFileSync('./fakeData.json',{encoding: 'utf-8'})
// Data to seed
const data = JSON.parse(json)

// Function to seed the database
async function seedDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Select the database
    const db = client.db(dbName);

    // Insert data into a collection
    const result = await db.collection('people').insertMany(data);
    console.log(`${result.insertedCount} documents inserted`);
    console.log('result:',result)

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection to MongoDB closed');
  }
}

// Call the function to seed the database
seedDatabase();
