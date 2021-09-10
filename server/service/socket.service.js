module.exports = (socket) => {
  console.log(`'Connected Socket ID : ' ${socket.id}`)

  socket.on('roomjoin', (userid) => {
    console.log(userid)
    socket.join(userid)
  })

  socket.on('alert', (data) => {
    console.log(data)
    socket.emit('show', data)
  })

  //   socket.on('alert', (touserid) => {
  //     io.to(touserid).emit('heejewake', touserid)
  //   })
}
