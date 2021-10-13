const { saveChatting, deleteChatId } = require('../service/socket.service');
const getCrawler = require('../service/web_crawling');

exports.socketHandler = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`);

  //   socket.user = { id: socket.id, user_id: user_id };

  socket.on('userJoin', (userid) => {
    console.log(userid);
    socket.join(userid);
  });

  socket.on('chat', async (data) => {
    await divideMessageType(data, data.option || '평점순');
    try {
      await saveChatting(socket.id, data);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('disconnect', async () => {
    console.log('socket disconnect!');
    await deleteChatId(socket.id, 'req.body.user_id');
  });

  function sendMessage(data) {
    socket.emit('chat', data);
  }

  async function divideMessageType(data, option) {
    switch (data.step) {
      case 1:
        sendMessage('1단계 응답');
        break;
      case 2:
        const recvData = await getCrawler.getData(data.input, option);
        sendMessage(recvData);
        break;
      case 3:
        sendMessage('3단계 응답');
        break;
    }
  }
};
