const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const logger = require("../util/log");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// exports.join = async (req, res) => {
//   const emailExist = await User.findOne({ email: req.body.email });
//   if (emailExist) {
//     return res.status(500).send("Email already exists");
//   }
//   //hash passwords
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(req.body.password, salt);
//   const client_token = String(Math.random());
//   const token = await bcrypt.hash(client_token, salt);
//   const today = new Date();
//   const tomorrow = new Date(today.setDate(today.getDate() + 1));

//   const user = new User({
//     email: req.body.email,
//     password: hashedPassword,
//     content: req.body.content,
//     acs_token: token,
//     acs_exp: tomorrow,
//   });

//   try {
//     await user.save();
//     res.send({ user: user._id, access_token: client_token, acs_exp: tomorrow });
//   } catch (err) {
//     res.status(400).send(err);
//   }
// };

// exports.login = async (req, res) => {
//   const loginSalt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(req.body.password, loginSalt);
//   console.log(hashedPassword);

//   const checkUser = await User.findOne({
//     email: req.body.email,
//   });
//   console.log(checkUser);

//   bcrypt.hash(req.body.password, 10, (err, hash) => {
//     console.log("hash", hash);
//     if (err) {
//       throw err;
//     }
//     bcrypt.compare(req.body.password, hash, async (err, result) => {
//       if (err) {
//         return res.status(500).send("User is not found");
//       }
//       if (result) {
//         const salt = await bcrypt.genSalt(10);
//         const token = await bcrypt.hash(String(Math.random()), salt);

//         const today = new Date();
//         const tomorrow = new Date(today.setDate(today.getDate() + 1));

//         User.updateOne(
//           { email: req.body.email },
//           { $set: { acs_token: token, acs_exp: tomorrow } }
//         );

//         res.json({ status: "00", token: token });
//       }
//     });
//   });
// };

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

exports.join = async (registerType, req, res) => {
  const reg_email =
    /^[0-9a-zA-Z]([\-.\w]*[0-9a-zA-Z\-_+])*@([0-9a-zA-Z][\-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/;
  const reg_pass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
  const inputMail = req.body.email;
  const inputPass = req.body.password;

  if (!inputMail || !inputPass) {
    res.json({ status: "01", msg: "no input" });
  } else if (!reg_email.test(inputMail)) {
    res.json({ status: "02", msg: "email fomat error" });
  } else if (!reg_pass.test(inputPass)) {
    res.json({
      status: "02",
      msg: "password fomat error",
    });
  } else {
    const data = await User.findOne({
      email: req.body.email,
    });
    if (data.length != 0) {
      res.json({ status: "02", msg: "email exist" });
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
      } catch {
        res.send(500).json({ msg: "join fail" });
      }

      //token
      const { accessToken } = await createToken(inputMail);
      if (accessToken) {
        const today = new Date();
        const tomorrow = new Date(today.setDate(today.getDate() + 1));

        User.updateOne(
          { email: req.body.email },
          { $set: { acs_token: accessToken, acs_exp: tomorrow } }
        );

        res.send(200).json({ accessToken: accessToken });
      } else {
        res.send(500).json({ msg: "token fail" });
      }
    }
  }
};

//
exports.login = async (registerType, req, res) => {
  const inputId = req.body.email;
  const inputPass = req.body.password;
  if (!inputId || !inputPass) {
    return res.send(400).json({ msg: "no input" });
  } else {
    const data = await User.findOne({
      email: inputId,
    });
    const dbPass = data.length > 0 ? data[0].pass : "";
    const validPass = await bcrypt.compare(inputPass, dbPass);
    if (!validPass) {
      return res.send(500).json({ msg: "login info error" });
    }
    //토큰 발행
    else {
      const { accessToken } = await createToken(inputId);
      res.send(200).json({
        accessToken: accessToken,
      });
    }
  }
};

exports.getContens = async (req, res) => {
  const checkUser = await User.find({
    _id: req.user.id,
  });
  console.log(checkUser);
  res.json({ status: "00", msg: checkUser });
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

  if (!inputToken) return res.sendStatus(401);

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
