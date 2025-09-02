import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  jwt.verify(token, "myFuckingSecret", (err, user) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        res.status(403).json({ message: `Access denied. Invalid token` });
      } else if (err.name === "TokenExpiredError") {
        res.status(403).json({ message: `Access denied. Token expired` });
      } else {
        res.status(500).json({ message: `Internal Server Error` });
      }
    }

    if (user) {
      req.user = user;
      console.log(user);
      next();
    }
  });
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Forbidden: You don’t have access 🚫` });
    }

    next();
  };
}
