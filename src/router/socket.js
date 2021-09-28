const socketHandler = {};

const socket = '';
const user_id = '';

socketHandler.setSocketUser = (socket, user_id) => {
  this.socket = socket;
  this.user_id = user_id;
};

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
