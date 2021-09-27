import axios from 'axios';

const chatAxios = {};

chatAxios.init = (socket, userId) =>
  axios.get(`http://localhost:3333/api/socket${userId}`).then((res) => {
    console.log('response data : ', res.data);
    // setUserId(String(res.data.userId));
    axios
      .post('http://localhost:3333/api/socket', {
        socket_id: socket.id,
        user_id: res.data.userId,
      })
      .then((data) => {
        console.log(socket);
      })
      .catch((e) => {
        new Error(e);
      });
    // socket.emit('userJoin', userId);
  });

export default chatAxios;
