// 1. Simple Login & Profile

import express from "express";
import session from "express-session";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "my-fucking-secret",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false },
  })
);
const mockUsers = [
  { username: "Gtech23", password: "user123" },
  { username: "Pious3", password: "user234" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser) return res.status(404).json({ error: `User does not exist` });

  // check credentials
  if (findUser.password === password) {
    req.session.user = findUser;
    res.status(200).json({ message: `Login successful` });
    console.log(req.session);
  } else {
    res.status(401).json({ error: `Incorrect credentials` });
  }
});

app.get("/profile", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: `Unauthorized` });
  return res
    .status(200)
    .json({ message: `Username: ${req.session.user.username}` });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: `Logout successful` });
});
app.listen(PORT, () => {
  console.log(`Server connected to PORT ${PORT}`);
});
