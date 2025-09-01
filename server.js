// 3. JSON Web Token

import express from "express";
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const PORT = process.env.PORT || 3000;

const app = express();

// fake database
const users = [];

// register endpoint
app.post('/register', (req, res) => {
  const {username, password} = req.body;
  const hashPassword = bcrypt.hash(password, 15);

  users.push({username, hashPassword});
  res.json({message: `User registered successfully`});
  console.log(users)
})

app.listen(PORT, () => {
  console.log(`Server connected to PORT ${PORT}`);
});
