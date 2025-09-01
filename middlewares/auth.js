import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers["authorization"];
  const token = header.split(" ")[1];
  if (!header && !token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  jwt.verify(token, "FuckingSecretKey", (err, user) => {
    console.log(user);
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
      next();
    }
  });
}
