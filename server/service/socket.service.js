module.exports = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`)

  socket.on('roomjoin', (userid) => {
    console.log(userid)
    socket.join(userid)
  })

  // socket.on('alert', (data) => {
  //   socket.emit('eco-test', data)
  // })

  socket.on('chat', (data) => {
    socket.emit('answer', '챗봇 응답')
  })

  //   socket.on('alert', (touserid) => {
  //     io.to(touserid).emit('heejewake', touserid)
  //   })
}
