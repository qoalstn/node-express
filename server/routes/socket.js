const router = require('express').Router()
const { init } = require('../service/socket.service')

router.get('/socket/test', (req, res) => {
  res.send('connected')
})

router.get('/socket', init)

module.exports = router
