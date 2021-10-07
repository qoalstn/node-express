const { MongoClient } = require('mongodb');

require('dotenv').config();

exports.conn = async () => {
  const client = new MongoClient(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();

    const database = client.db('myFirstDatabase');
    const users = database.collection('users');

    return users;
  } catch (error) {
    throw new Error(error);
  }
};
