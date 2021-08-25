const router = require("express").Router();
const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { join, login, checkUser, info } = require("../service/auth.service");

require("dotenv").config();

//join
router.post("/register", join);

//Login
router.post("/login", login);

router.get("/contents", authorizationToken, checkUser);

//회원정보 업데이트
router.post("/info", authorizationToken, info);

router.post("/jwt", (req, res) => {
  const jwtTest = jwt.sign({ name: "aria" }, "hello");
  const decode = jwt.decode(jwtTest);
  res.status(200).send(jwtTest);
});

module.exports = router;
