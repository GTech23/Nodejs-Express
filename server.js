// 2. Shopping Cart with Session

import express from "express";
import session from "express-session";
import { nanoid } from "nanoid";

import { checkAuth } from "./middlewares/session-auth.js";
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
    req.session.user.cartItems = [];
    res.status(200).json({ message: `Login successful` });
    console.log(req.session);
  } else {
    res.status(401).json({ error: `Incorrect credentials` });
  }
});

app.get("/profile", checkAuth, (req, res) => {
  return res
    .status(200)
    .json({ message: `Username: ${req.session.user.username}` });
});

app.post("/api/product", checkAuth, (req, res) => {
  const cartItem = { id: nanoid(), ...req.body };
  req.session.user.cartItems.push(cartItem);
  res.status(201).json({ message: `Item add to cart` });
  console.log(req.session);
});

app.get("/api/cart", checkAuth, (req, res) => {
  const session = req.session.user;
  const sessionCart = session.cartItems;

  if (sessionCart.length === 0)
    return res.status(200).json({ message: "Your cart is empty" });

  return res.status(200).json({ cart: sessionCart });
});

app.delete("/api/cart/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const session = req.session.user;
  let sessionCart = session.cartItems;
  const cartToDelete = sessionCart.filter((cart) => cart.id !== id);
  session.cartItems = cartToDelete;
  res.status(200).json({ message: `Cart ${id} deleted` });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: `Logout successful` });
});
app.listen(PORT, () => {
  console.log(`Server connected to PORT ${PORT}`);
});
