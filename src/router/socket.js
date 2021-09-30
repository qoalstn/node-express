const socketHandler = {};

const socket = '';
const user_id = '';

socketHandler.setSocketUser = (socket, user_id) => {
  this.socket = socket;
  this.user_id = user_id;
};

socketHandler.answer = (socket, setChat) => {
  socket.on('chat', (data) => {
    console.log('recvchat : ', data);
    setChat(data);
  });
};

socketHandler.recvMessage = (socket, data) => {
  socket.emit('chat', data);
};

export default socketHandler;
