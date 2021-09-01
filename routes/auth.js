const router = require("express").Router();
const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  join,
  login,
  getContens,
  updateUserInfo,
  authorizationToken,
  writeContent,
  sendToken,
} = require("../service/auth.service");

require("dotenv").config();

router.post("/register", join, sendToken);

router.post("/login", login, sendToken);

router.post("/content", authorizationToken, writeContent);

router.get("/content", authorizationToken, getContens);

router.post("/info", authorizationToken, updateUserInfo);

// router.post("/jwt", (req, res) => {
//   const jwtTest = jwt.sign({ name: "aria" }, "hello");
//   const decode = jwt.decode(jwtTest);
//   res.status(200).send(jwtTest);
// });

module.exports = router;
