import React from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io.connect('http://localhost:3333/', {
  transports: ['websocket'],
})

export default class Message extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userid: 'been',
      chatText: '',
    }
  }
  componentWillMount() {
    socket.emit('roomjoin', this.state.userid)
    socket.on('show', (data) => {
      alert(`success : ${data}`)
    })
  }
  onclick = (e) => {
    console.log('chatText >> ', this.chatText)
    socket.emit('alert', this.chatText)
  }
  onChange = (e) => {
    console.log(e.target.value)
    this.chatText = e.target.value
  }

  render() {
    return (
      <div>
        <button onClick={this.onclick}>알림창 보내기</button>
        <div>
          <input
            className="chatting-text"
            type="text"
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}
