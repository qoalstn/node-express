const { conn } = require('../util/db_config');
const mongo = require('mongodb');

exports.init = async (req, res) => {
  const user = await conn();
  try {
    const createdId = await user.insert({});
    // console.log('success : ', createdId)
    if (!createdId) {
      throw new Error('Fail create user');
    }
    res.status(200).json({
      statusCode: '00',
      userId: createdId.insertedIds[0],
    });
  } catch (e) {
    throw new Error(e);
  }
};

//TODO : save chatting
exports.saveSocketInfo = async (req, res) => {
  const user = await conn();
  const _id = new mongo.ObjectID(req.body.user_id);

  try {
    await user.updateOne(
      { _id: _id },
      { $set: { socket_id: req.body.socket_id } }
    );
  } catch (e) {
    console.log(e);
  }
};

exports.socketHandler = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`);

  socket.on('userJoin', (userid) => {
    console.log(userid);
    socket.join(userid);
  });

  socket.on('chat', async (data) => {
    socket.emit('answer', '1단계');
    console.log(data);
    await saveChatting(data);
  });
};

async function saveChatting(data) {
  const user = await conn();
  if (!data) {
    throw new Error();
  }
  try {
    const result = await user.insert({ email: data });
  } catch (e) {
    throw new Error(e);
  }
}
