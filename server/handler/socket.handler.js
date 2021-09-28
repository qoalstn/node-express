const { saveChatting, deleteChatId } = require('../service/socket.service');

exports.socketHandler = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`);

  //   socket.user = { id: socket.id, user_id: user_id };

  socket.on('userJoin', (userid) => {
    console.log(userid);
    socket.join(userid);
  });

  socket.on('chat', async (data) => {
    socket.emit('chat', '1단계');
    await saveChatting(socket.id, data);
  });

  socket.on('disconnect', async () => {
    console.log('socket disconnect!');
    await deleteChatId(socket.id, 'req.body.user_id');
  });
};
