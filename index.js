const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

//Middleware
app.use(morgan("dev"));
app.use(express.json());

//Connect to DB
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to mongoDB!")
);

const authRoute = require("./routes/auth");

//Route Middlewares
app.use("/api/user", authRoute);

app.get("/", (req, res) => {
  res.send("hello!");
});

app.listen(3333, () => console.log("3333 server start"));
