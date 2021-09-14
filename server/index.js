const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

//Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('connected to mongoDB!')
)

const authRoute = require('./routes/auth')
const socketRoute = require('./routes/socket')

app.use('/api/user', authRoute)
app.use('/api', socketRoute)

app.get('/', (req, res) => {
  res.json({ title: 'hello!' })
})

const port = 3333

var http = require('http').createServer(app)
const io = require('socket.io')(http)

const { socketHandler } = require('./service/socket.service')

io.on('connection', socketHandler)

// app.listen(3333, () => console.log('3333 server start'))

http.listen(port, () => {
  console.log(`express is running on ${port}`)
})
