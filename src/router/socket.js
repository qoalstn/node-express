const socketHandler = {};

socketHandler.answer = (socket, setAnswer) => {
  socket.on('chat', (data) => {
    console.log('chat : ', data);
    setAnswer(data);
  });
};

socketHandler.recvMessage = (socket, data) => {
  socket.emit('chat', data);
};

export default socketHandler;
