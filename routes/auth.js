const router = require("express").Router();
const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../util/log");

require("dotenv").config();

//join
router.post("/register", async (req, res) => {
  //중복체크
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const random = Math.random();
  const token = await bcrypt.hash(String(random), salt);
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));

  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    content: req.body.content,
    acs_token: token,
    acs_exp: tomorrow,
  });

  try {
    await user.save();
    res.send({ user: user._id, access_token: token, acs_exp: tomorrow });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  logger.info(req.body);
  const checkUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!checkUser) {
    return res.status(500).send("User is not found");
  }

  const salt = await bcrypt.genSalt(10);
  const token = await bcrypt.hash(String(Math.random()), salt);

  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));

  User.updateOne({ email: req.body.email }, { $set: { acs_token: token, acs_exp: tomorrow } });

  res.json({ status: "00", token: token });
});

router.get("/contents", authorizationToken, async (req, res) => {
  const checkUser = await User.findOne({
    _id: req.user.id,
  });
  console.log(checkUser);
  res.json({ status: "00", msg: checkUser });
});

//회원정보 업데이트
router.post("/info", authorizationToken, async (req, res) => {
  const inputMail = req.body.email;
  const inputContent = req.body.content;
  console.log(inputContent, inputMail);

  try {
    await User.updateOne({ email: inputMail }, { $set: { content: inputContent } });
    res.status(200).json({ msg: "success update" });
  } catch {
    throw new Error("fail update");
  }
});

async function authorizationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const inputToken = authHeader && authHeader.split(" ")[1];

  const checkUser = await User.findOne({
    email: req.body.email,
    acs_token: inputToken,
  });

  if (!inputToken) return res.sendStatus(401);

  if (!checkUser) return res.status(500).send("no data");

  if (checkUser.acs_token != inputToken) {
    return res.status(403).send("Invalid token");
  }
  next();
}

module.exports = router;
