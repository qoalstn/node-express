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

//Connect to DB
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('connected to mongoDB!')
)

const authRoute = require('./routes/auth')

//Route Middlewares
app.use('/api/user', authRoute)

app.get('/', (req, res) => {
  res.json({ title: 'hello!' })
})

const { createServer } = require('http')
const server = createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

io.on('connection', onConnection)

app.listen(3333, () => console.log('3333 server start'))
