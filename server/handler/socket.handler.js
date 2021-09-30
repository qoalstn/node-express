const { saveChatting, deleteChatId } = require('../service/socket.service');

exports.socketHandler = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`);

  //   socket.user = { id: socket.id, user_id: user_id };

  socket.on('userJoin', (userid) => {
    console.log(userid);
    socket.join(userid);
  });

  socket.on('chat', async (data) => {
    // socket.emit('chat', '1단계');
    ramifyMessageType(data);
    await saveChatting(socket.id, data);
  });

  socket.on('disconnect', async () => {
    console.log('socket disconnect!');
    await deleteChatId(socket.id, 'req.body.user_id');
  });

  function sendMessage(data) {
    socket.emit('chat', data);
  }

  function ramifyMessageType(data) {
    switch (data.step) {
      case '1단계':
        sendMessage('1단계 응답');
      case '2단계': {
        sendMessage('2단계 응답');
      }
    }
  }
};
