const { MongoClient } = require('mongodb')

require('dotenv').config()

exports.conn = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URL, {
      useUnifiedTopology: true,
    })
    await client.connect()

    const database = client.db('myFirstDatabase')
    const users = database.collection('users')

    return users
  } catch (error) {
    throw new Error(error)
  }
}
