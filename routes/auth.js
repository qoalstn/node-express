const router = require("express").Router();
const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    pass: hashedPassword,
    acs_token: token,
    acs_exp: tomorrow,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id, access_token: token, acs_exp: tomorrow });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const checkUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!checkUser) {
    return res.status(400).send("User is not found");
  }
  const validPass = await bcrypt.compare(req.body.password, checkUser.password); //입력한 비밀번호와 DB의 비밀번호를 비교, true 또는 false를 반환한다.
  if (!validPass) {
    return res.status(400).send("Invalid password");
  }
  //create and assign a token
  const access = await signAccessToken();
  const token = jwt.sign(
    { _id: user._id, email: req.body.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.send("success login!!");
});

module.exports = router;
