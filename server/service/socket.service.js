const { conn } = require('../util/db_config')

exports.init = async (req, res) => {
  const user = await conn()
  try {
    const createdId = await user.insert({})
    // console.log('success : ', createdId)
    if (!createdId) {
      throw new Error('Fail create user')
    }
    res.status(200).json({
      statusCode: '00',
      userId: createdId.insertedIds[0],
    })
  } catch (e) {
    throw new Error(e)
  }
}

//TODO : save chatting

exports.socketHandler = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`)

  socket.on('userJoin', (userid) => {
    console.log(userid)
    socket.join(userid)
  })

  socket.on('chat', (data) => {
    socket.emit('answer', '챗봇 응답')
  })

  //   socket.on('alert', (touserid) => {
  //     io.to(touserid).emit('heejewake', touserid)
  //   })
}
