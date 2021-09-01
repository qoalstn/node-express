const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const logger = require("../util/log");
const jwt = require("jsonwebtoken");

require("dotenv").config();

async function createToken(inputMail) {
  const accessToken = jwt.sign({ id: inputMail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "12h",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign({ id: inputMail }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "14d",
    algorithm: "HS256",
  });
  return { accessToken, refreshToken };
}

exports.sendToken = async (req, res) => {
  console.log(req.body.email);
  const { accessToken } = await createToken(req.body.email);
  console.log(accessToken);
  if (accessToken) {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));

    //todo : update, fail > transaction // test : api/user/register
    try {
      await User.updateOne(
        { email: req.body.email },
        { $set: { acs_token: accessToken, acs_exp: tomorrow } },
        (upsert = true),
        (multi = true)
      );
    } catch {
      throw new Error();
    }
    res.status(200).json({ accessToken: accessToken });
  } else {
    res.status(500).json({ msg: "token fail" });
  }
};

exports.join = async (req, res, next) => {
  const reg_email =
    /^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/;
  const reg_pass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
  const inputMail = req.body.email;
  const inputPass = req.body.password;

  if (!inputMail || !inputPass) {
    return res.status(400).send("no input");
  } else if (!reg_email.test(inputMail)) {
    return res.status(400).send("email format error");
  } else if (!reg_pass.test(inputPass)) {
    return res.status(400).send("password format error");
  } else {
    const data = await User.findOne({
      email: req.body.email,
    });

    if (data) {
      return res.status(400).send("email exist");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(inputPass, salt);

      //DB
      try {
        const user = new User({
          email: req.body.email,
          password: hashedPass,
        });
        await user.save();
        next();
      } catch {
        return res.status(500).send("join fail");
      }
    }
  }
};

exports.login = async (req, res, next) => {
  const inputId = req.body.email;
  const inputPass = req.body.password;
  if (!inputId || !inputPass) {
    return res.status(400).send("no input");
  } else {
    const data = await User.findOne({
      email: inputId,
    });
    const dbPass = data.length > 0 ? data[0].pass : "";
    const validPass = await bcrypt.compare(inputPass, dbPass);
    if (!validPass) {
      return res.status(500).send("login info error");
    } else {
      next();
    }
  }
};

exports.getContens = async (req, res) => {
  const checkUser = await User.find({
    _id: req.user.id,
  });
  console.log(checkUser);
  res.status(200).json({ msg: checkUser });
};

//todo :
exports.writeContent = (req, res) => {
  const inputContent = req.body.content;

  User.updateOne({ email: req.body.email }, { $set: { content: inputContent } });

  res.status(200).send("update success");
};

exports.updateUserInfo = async (req, res) => {
  const inputMail = req.body.email;
  const inputAdrr = req.body.adrr;

  try {
    await User.updateOne({ email: inputMail }, { $set: { adrr: inputAdrr } });
    res.status(200).json({ msg: "success update" });
  } catch {
    throw new Error("fail update");
  }
};

exports.authorizationToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const inputToken = authHeader && authHeader.split(" ")[1];

  if (!inputToken) return res.status(401).send("no token");

  const checkUser = await User.findOne({
    email: req.body.email,
  });

  if (!checkUser) return res.status(500).send("no data");

  bcrypt.hash(inputToken, 10, (err, hash) => {
    if (err) {
      return res.status(500).send("Unavailable token");
    }
    bcrypt.compare(inputToken, hash, async (err, result) => {
      if (err) {
        return res.status(500).send("Unavailable token");
      }
      if (result) {
        next();
      } else {
        throw new Error("authorization error");
      }
    });
  });
};
