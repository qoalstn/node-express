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
  const [answer, setAnswer] = useState('asdf');
  const [chat, setChat] = useState([{ send: 'Chat Start!!', answerMsg: answer }]);
  // const [userId, setUserId] = useState('611a0ce75d32c32970bd58b2');
  const [userId, setUserId] = useState('');
  const [input, setInput] = useState('');

  chatAxios.init(socket, userId);
  socketHandler.answer(socket, setAnswer);

  function onChange(e) {
    setInput(e.target.value);
  }

  function sendData(e) {
    // console.log('chat', chat);
    if (!input) return alert('내용을 입력 해주세요');

    setChat([...chat, { send: input, answerMsg: answer }]);
    setInput('');
    socketHandler.recvMessage(socket, chat);
  }

  return (
    <div>
      <div className="input-container">
        <input className="input-text" type="text" onChange={onChange} name="input" value={input} />
        <button onClick={sendData}> SEND DATA </button>
      </div>
      <div className="chat-container">
        {chat.map((i, index) => {
          console.log('map', i);
          return (
            <ChatList
              key={index}
              leftChat="leftChat"
              rightChat="rightChat"
              chat={i.send || '--'}
              answer={index}
            ></ChatList>
          );
        })}
      </div>
    </div>
  );
}

// export default React.memo(App);
export default App;
