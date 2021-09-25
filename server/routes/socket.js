const router = require('express').Router()
const { checkInit, init, saveSocketInfo } = require('../service/socket.service')

router.get('/socket/test', (req, res) => {
  res.send('connected')
})

router.get('/socket:userId', checkInit)
router.get('/socket', init)
router.post('/socket', saveSocketInfo)

module.exports = router
