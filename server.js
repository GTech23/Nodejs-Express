// 3. JSON Web Token

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { auth } from "./middlewares/auth.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// fake database
const users = [];

// register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  users.push({ username, hashPassword });
  console.log(users);
  res.json({ message: `User registered successfully` });
});

// login endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const findUser = users.find((user) => user.username === username);
    console.log(findUser);
    if (!findUser)
      return res.status(401).json({ message: `Invalid username or password` });

    // verify hash
    const isValid = await bcrypt.compare(password, findUser.hashPassword);
    console.log(isValid);
    if (!isValid)
      return res.status(401).json({ message: `Incorrect Password` });

    const token = jwt.sign({ username }, "FuckingSecretKey", {
      expiresIn: "1hr",
    });
    console.log(token);
    res.status(200).json({ message: `User logged in successfully`, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Internal Server Error` });
  }
});

// protected route
app.get("/dashboard", auth, (req, res) => {
  res
    .status(200)
    .json({ message: `Welcome to your dashboard ${req.user?.username}` });
});

app.listen(PORT, () => {
  console.log(`Server connected to PORT ${PORT}`);
});
