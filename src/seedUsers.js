// seed-db.js

const { MongoClient } = require('mongodb');
const fs = require('fs')
const bcrypt = require('bcryptjs')
// Connection URI
const uri = 'mongodb://root:passwd@localhost:8082/';

// Database Name
const dbName = 'persons';
const data = JSON.parse(fs.readFileSync('./fakeData.users.json',{encoding: 'utf-8'}))
// Data to seed
// for (let index = 0; index < data.length; index++) {
//     const el = data[index];
//     // const salt = bcrypt.genSaltSync()
//     // el.salt = salt
//     // console.log('salt:',salt)
//     el.passwordHash = bcrypt.hashSync(el.passwordHash,el.salt)
// }
// fs.writeFileSync("./fakeData.users.json",JSON.stringify(data))
// console.log('data:',data)
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
    const result = await db.collection('users').insertMany(data);
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
