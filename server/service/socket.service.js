const { conn } = require('../util/db_config');
const mongo = require('mongodb');

//기존 채팅 내역 여부 확인
exports.checkInit = async (req, res, next) => {
  const user = await conn();
  // console.log(req.params.userId); //{ userId: '611a0ce75d32c32970bd58b2' }
  const _id = new mongo.ObjectID(req.params.userId);

  if (!req.params.userId) {
    return next('route');
  }
  try {
    const existUser = await user.findOne(_id);

    if (!existUser) {
      res.status(500).json({ msg: 'server error' });
    }
    res.status(200).json({ user_id: existUser._id });
  } catch (e) {
    throw new Error(e);
  }
};

//기존 채팅 내역이 없을 경우 새로운 채팅 아이디 생성
exports.init = async (req, res) => {
  const user = await conn();
  try {
    const createdId = await user.insertOne({});
    console.log('success : ', createdId);
    if (!createdId) {
      throw new Error('Fail create user');
    }
    res.status(200).json({
      statusCode: '00',
      userId: createdId.insertedId,
    });
  } catch (e) {
    throw new Error(e);
  }
};

//채팅 아이디 및 소켓 아이디를 DB에 저장
exports.saveSocketInfo = async (req, res) => {
  const user = await conn();
  const _id = new mongo.ObjectID(req.body.user_id);

  try {
    console.log('통과', req.body.socket_id, '+', _id);
    await user.updateOne(
      { _id: _id },
      { $set: { socket_id: req.body.socket_id } }
    );
  } catch (e) {
    console.log(e);
  }
};
exports.saveChatting = async (data) => {
  const user = await conn();
  // if (!data) {
  //   throw new Error();
  // }
  // try {
  //   const result = await user.updateOne(
  //     { _id: userId },
  //     { $set: { socket_id: 'deleted' } }
  //   );
  // } catch (e) {
  //   throw new Error(e);
  // }
};

//todo : delete chat ('disconnect')
exports.deleteChatId = async (socketId, userId) => {
  const user = await conn();

  try {
    console.log('delete chat id 통과 : ', socketId);
    await user.updateOne({ _id: userId }, { $set: { socket_id: 'deleted' } });
  } catch (e) {
    console.log(e);
  }
};
