const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
const fakerbr = require('faker-br')
fakerbr.locale = 'pt_BR'
// const fs = require('fs')
// Connection URI
const uri = 'mongodb://root:passwd@localhost:9082/';

// Database Name
const dbName = 'persons';
// const json = fs.readFileSync('./fakeData.json',{encoding: 'utf-8'})
// Data to seed
// const data = JSON.parse(json)

const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Curitiba', 'Fortaleza', 'Manaus', 'Recife', 'Goiânia'];
const limit = 10_000
function generateCEP(state) {
  return `${fakerbr.address.zipCodeByState(state ?? 'AC')}`
}
function generatePerson() {  
  const estado = fakerbr.address.stateAbbr()
  const cidade = fakerbr.address.city()
  return {
    nome: `${faker.person.firstName()} ${faker.name.lastName()}`,
    sexo: faker.number.int({ min: 1, max: 3 }),
    dataNascimento: faker.date.past(),
    estadoCivil: faker.number.int({ min: 1, max: 4 }),
    enderecos: [{
      cep: generateCEP(estado),
      endereco: `Rua ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      numero: Math.floor(Math.random() * 1000) + 1,
      complemento: `Apto ${Math.floor(Math.random() * 100) + 1}`,
      bairro: 'Centro',
      estado: estado,
      cidade: cidade
    }]
  };  
}
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
    const persons = Array.from({length: limit},(_,i) => generatePerson());
    const result = await db.collection('people').insertMany(persons);
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
