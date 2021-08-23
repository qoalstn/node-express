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

  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) {
      throw err;
    }

    bcrypt.compare(checkUser.password, hash, function (err, result) {
      if (err) {
        return res.status(403).send("Invalid password");
      }
      console.log("result", result);
    });
  });

  const accessToken = jwt.sign({ id: checkUser._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.json({ status: "00", token: accessToken });
});

router.get("/contents", authorizationToken, async (req, res) => {
  const checkUser = await User.findOne({
    _id: req.user.id,
  });
  console.log(checkUser);
  res.json({ status: "00", msg: checkUser });
});

function authorizationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const inputToken = authHeader && authHeader.split(" ")[1];

  if (inputToken == null) return res.sendStatus(401);

  jwt.verify(inputToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
