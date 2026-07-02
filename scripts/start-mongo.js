const { MongoMemoryServer } = require('mongodb-memory-server');

async function startMongo() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(uri);
}

startMongo().catch(console.error);
