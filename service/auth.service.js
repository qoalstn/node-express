const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const logger = require("../util/log");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.join = async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(500).send("Email already exists");
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
};

exports.login = async (req, res) => {
  const loginSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, loginSalt);
  console.log(hashedPassword);

  const checkUser = await User.findOne({
    email: req.body.email,
  });
  console.log(checkUser);

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      throw err;
    }

    bcrypt.compare(checkUser.password, hash, async (err, result) => {
      if (err) {
        return res.status(500).send("User is not found");
      } else {
        const salt = await bcrypt.genSalt(10);
        const token = await bcrypt.hash(String(Math.random()), salt);

        const today = new Date();
        const tomorrow = new Date(today.setDate(today.getDate() + 1));

        User.updateOne(
          { email: req.body.email },
          { $set: { acs_token: token, acs_exp: tomorrow } }
        );

        res.json({ status: "00", token: token });
      }
    });
  });
};

exports.checkUser = (req, res) => {
  const checkUser = await User.findOne({
    _id: req.user.id,
  });
  console.log(checkUser);
  res.json({ status: "00", msg: checkUser });
};

exports.info = (req, res) => {
  const inputMail = req.body.email;
  const inputContent = req.body.content;
  console.log(inputContent, inputMail);

  try {
    await User.updateOne({ email: inputMail }, { $set: { content: inputContent } });
    res.status(200).json({ msg: "success update" });
  } catch {
    throw new Error("fail update");
  }
};

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
