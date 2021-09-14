const User = require('../model/User.js')
const bcrypt = require('bcryptjs')
const logger = require('../util/log')
const jwt = require('jsonwebtoken')
const { conn } = require('../util/db_config')

require('dotenv').config()

async function createToken(inputMail) {
  const accessToken = jwt.sign(
    { email: inputMail },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '12h',
      algorithm: 'HS256',
    }
  )
  const refreshToken = jwt.sign(
    { email: inputMail },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '14d',
      algorithm: 'HS256',
    }
  )
  return { accessToken, refreshToken }
}

exports.sendToken = async (req, res) => {
  const { accessToken } = await createToken(req.body.email)
  if (accessToken) {
    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1))

    const users = await conn()
    //todo : update, fail > transaction // test : api/user/register
    try {
      await users.updateOne(
        { email: req.body.email },
        { $set: { acs_token: accessToken, acs_exp: tomorrow } },
        (upsert = true),
        (multi = true)
      )
    } catch (err) {
      throw new Error(err)
    }
    res.status(200).json({ accessToken: accessToken })
  } else {
    res.status(500).json({ msg: 'token fail' })
  }
}

exports.join = async (req, res, next) => {
  const reg_email =
    /^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/
  const reg_pass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
  const inputMail = req.body.email
  const inputPass = req.body.password

  if (!inputMail || !inputPass) {
    return res.status(400).send('no input')
  } else if (!reg_email.test(inputMail)) {
    return res.status(400).send('email format error')
  } else if (!reg_pass.test(inputPass)) {
    return res.status(400).send('password format error')
  } else {
    const data = await User.findOne({
      email: req.body.email,
    })

    if (data) {
      return res.status(400).send('email exist')
    } else {
      const salt = await bcrypt.genSalt(10)
      await bcrypt.hash(inputPass, salt, async (err, hash) => {
        if (err) {
          throw new Error(err)
        } else {
          //DB
          try {
            const user = new User({
              email: req.body.email,
              password: hash,
            })
            await user.save()
            next()
          } catch {
            return res.status(500).send('join fail')
          }
        }
      })
    }
  }
}

exports.login = async (req, res, next) => {
  const inputId = req.body.email
  const inputPass = req.body.password
  if (!inputId || !inputPass) {
    return res.status(400).send('no input')
  } else {
    const data = await User.findOne({
      email: inputId,
    })
    const dbPass = data ? data.password : ''
    await bcrypt.compare(inputPass, dbPass, (err, result) => {
      if (err) {
        throw new Error(err)
      }
      if (!result) {
        return res.status(500).send('login info error')
      } else {
        next()
      }
    })
  }
}

exports.getContens = async (req, res) => {
  const checkUser = await User.find({
    email: req.body.email,
  })
  console.log(checkUser)
  res.status(200).json({ msg: checkUser })
}

exports.writeContent = async (req, res) => {
  const inputContent = req.body.content
  const users = await conn()

  //todo : exception handling - if exceed content length
  if (!inputContent) return res.status(400).send('no content')

  const filter = { email: req.body.email }
  const options = { upsert: true }
  const updateDoc = {
    $push: {
      content: inputContent,
    },
  }
  try {
    await users.updateOne(filter, updateDoc, options)
  } catch (error) {
    throw new Error(error)
  }

  res.status(200).send('update success')
}

exports.updateUserInfo = async (req, res) => {
  const inputMail = req.body.email
  const inputAdrr = req.body.adrr

  try {
    await User.updateOne({ email: inputMail }, { $set: { adrr: inputAdrr } })
    res.status(200).json({ msg: 'success update' })
  } catch {
    throw new Error('fail update')
  }
}

exports.authorizationToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const inputToken = authHeader && authHeader.split(' ')[1]

  if (!inputToken) return res.status(401).send('no token')

  const checkUser = await User.findOne({
    email: req.body.email,
    acs_token: inputToken,
  })

  if (!checkUser) return res.status(500).send('no data')

  bcrypt.hash(inputToken, 10, (err, hash) => {
    if (err) {
      return res.status(500).send('Unavailable token')
    }
    bcrypt.compare(inputToken, hash, async (err, result) => {
      if (err) {
        return res.status(500).send('Unavailable token')
      }
      if (result) {
        next()
      } else {
        throw new Error('authorization error')
      }
    })
  })
}
