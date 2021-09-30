import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import chatAxios from './router/config';
import socketHandler from './router/socket';
import ChatList from './components/chatList';

function App(props) {
  const [socket, setSocket] = useState(
    io.connect('http://localhost:3333/', {
      transports: ['websocket'],
    })
  );
  const [chat, setChat] = useState({
    send: 'Chat Start!!',
    answer: '',
    step: 0,
  });
  const [chatList, setChatList] = useState([]);

  // const [recvData, setrecvData] = useState({});
  const [answer, setAnswer] = useState('');
  // const [userId, setUserId] = useState('611a0ce75d32c32970bd58b2');
  const [userId, setUserId] = useState('');

  chatAxios.init(socket, userId);
  socketHandler.answer(socket, setChat);

  // useEffect(() => {
  // setTimeout(() => {
  // chatAxios.init(socket, userId);
  // socketHandler.answer(socket, setAnswer);
  // }, 2000);
  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  function onChange(e) {
    setChat({ send: e.target.value });
  }

  function sendData(e) {
    const sendStep = 1;
    setChat({ step: sendStep });
    socketHandler.recvMessage(socket, chat);
  }

  return (
    <div>
      <div className="input-container">
        <input className="input-text" type="text" onChange={onChange} />
        <button onClick={sendData}> SEND DATA </button>
      </div>
      <div className="chat-container">
        <ChatList
          leftChat="leftChat"
          rightChat="rightChat"
          chat={chat.send}
          answer={chat.answer}
        ></ChatList>
      </div>
    </div>
  );
}

export default React.memo(App);
