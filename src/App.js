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

  const [sendMsg, setSendMsg] = useState('');
  const [answer, setAnswer] = useState(['']);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([{ send: sendMsg, answerMsg: answer }]);
  // const [userId, setUserId] = useState('611a0ce75d32c32970bd58b2');
  const [userId, setUserId] = useState('');

  chatAxios.init(socket, userId);
  useEffect(() => {
    // socketHandler.answer(socket, setAnswer);
    return setChat([...chat, { send: sendMsg, answerMsg: answer }]);
  }, [answer]);

  function onChange(e) {
    setInput(e.target.value);
  }

  function sendData(e) {
    setChat(['']);
    if (!input) return alert('내용을 입력 해주세요');

    setSendMsg(input);
    socketHandler.answer(socket, setAnswer);
    const sendData = { input: input, step: chat.length };
    console.log(sendData);
    socketHandler.recvMessage(socket, sendData);
    setInput('');
  }

  return (
    <div>
      <div className="input-container">
        <input
          placeholder="'호텔' 또는 '펜션'"
          className="input-text"
          type="text"
          onChange={onChange}
          name="input"
          value={input}
        />
        <button onClick={sendData}> SEND DATA </button>
      </div>
      <div className="chat-container">
        {chat.map((i, index) => {
          return (
            <ChatList key={index} socket={socket} send={i.send} answer={i.answerMsg}></ChatList>
          );
        })}
      </div>
    </div>
  );
}

export default App;
