import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'
import axios from 'axios'

export default function Message(props) {
  // const socket = io.connect('http://localhost:3333/', {
  //   transports: ['websocket'],
  // });
  const [socket, setSocket] = useState(
    io.connect('http://localhost:3333/', {
      transports: ['websocket'],
    })
  )
  const [chat, setChat] = useState('Chat Start!!')
  const [answer, setAnswer] = useState('asdf')
  const [userId, setUserId] = useState('611a0ce75d32c32970bd58b2')

  useEffect(() => {
    axios.get(`http://localhost:3333/api/socket${userId}`).then((res) => {
      console.log('response data : ', res.data)
      // setUserId(String(res.data.userId));
      axios
        .post('http://localhost:3333/api/socket', {
          socket_id: socket.id,
          user_id: res.data.user_id,
        })
        .then((data) => {
          console.log(socket)
        })
        .catch((e) => {
          new Error(e)
        })
      // socket.emit('userJoin', userId);
    })
  }, [])

  socket.on('answer', (data) => {
    console.log('asdf')
    console.log('answer - ', data)
    setAnswer(data)
  })

  function onChange(e) {
    setChat(e.target.value)
  }

  function sendData(e) {
    socket.emit('chat', chat)
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
  )
}

// import React from 'react'
// import io from 'socket.io-client'
// import './App.css'

// const socket = io.connect('http://localhost:3333/', {
//   transports: ['websocket'],
// })

// export default class Message extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       userid: 'been',
//       chatText: '',
//     }
//   }
//   componentWillMount() {
//     socket.emit('roomjoin', this.state.userid)
//     socket.on('show', (data) => {
//       alert(`success : ${data}`)
//     })
//   }
//   onclick = (e) => {
//     socket.emit('alert', this.chatText)
//   }
//   onChange = (e) => {
//     this.chatText = e.target.value
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={this.onclick}>알림창 보내기</button>
//         <div>
//           <input
//             className="chatting-text"
//             type="text"
//             onChange={this.onChange}
//           />
//         </div>
//       </div>
//     )
//   }
// }
