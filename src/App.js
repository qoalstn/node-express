import React, { Component } from 'react'
import io from 'socket.io-client'
// 3. socket.io

// 2 .
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      socket: null,
    }
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:3333')
    fetch('http://localhost:3333')
      .then((res) => res.json())
      // .then((data) => console.log(data.title));
      .then((data) => this.setState({ username: data.title }))
  }

  render() {
    const { username } = this.state
    return (
      <div className="App">
        <header className="App-header">
          {username ? ` ${username}` : 'Hello World'}
        </header>
        <input type="text" />
      </div>
    )
  }
}

export default App

// 1 .
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
