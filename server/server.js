const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userdb = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("No token provided");
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Authentication failed" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.json({ auth: true, message: "Authenticated Successfully" });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = userdb.users.find((user) => {
      return user.email === email;
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    res.status(200).json({ auth: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Backend server is running!");
});
