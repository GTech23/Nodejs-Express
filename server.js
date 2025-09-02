// 4. ROLE BASED AUTHENTICATIONS

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { auth, authorize } from "./middlewares/auth.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// fake database
const users = [
  {
    username: "gtech23",
    password: bcrypt.hashSync("test123", 10),
    role: "admin",
  },
  {
    username: "pious3",
    password: bcrypt.hashSync("test123", 10),
    role: "user",
  },
];

// login endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const findUser = users.find((user) => user.username === username);

    if (!findUser)
      return res.status(401).json({ message: "Invalid username or password" });

    // verify hash
    const isValid = await bcrypt.compare(password, findUser.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ username, role }, "myFuckingSecret", {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      sameSite: "strict",
      httpOnly: true,
    });
    res.json({ message: "Login successful ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.json(`Welcome to your dashboard ${req.user.username}`);
});

// protected route
app.get("/admin", auth, authorize(["admin"]), (req, res) => {
  res.json(`Welcome back admin, ${req.user.username}`);
});
app.listen(PORT, () => {
  console.log(`Server connected to PORT ${PORT}`);
});
