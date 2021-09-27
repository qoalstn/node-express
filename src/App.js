import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import chatAxios from './router/config';
import socketHandler from './router/socket';

export default function Message(props) {
  const [socket, setSocket] = useState(
    io.connect('http://localhost:3333/', {
      transports: ['websocket'],
    })
  );
  const [chat, setChat] = useState('Chat Start!!');
  const [answer, setAnswer] = useState('asdf');
  // const [userId, setUserId] = useState('611a0ce75d32c32970bd58b2');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    chatAxios.init(socket, userId);
    socketHandler.answer(socket, setAnswer);
  }, []);

  function onChange(e) {
    setChat(e.target.value);
  }

  function sendData(e) {
    socketHandler.recvMessage(socket, chat);
  }

  return (
    <div>
      <div className="input-container">
        <input className="input-text" type="text" onChange={onChange} />
        <button onClick={sendData}> SEND DATA </button>
      </div>
      <div className="chat-container">
        <div className="left-chat">{chat}</div>
        <div className="right-chat">
          <div>{answer}</div>
        </div>
      </div>
    </div>
  );
}
