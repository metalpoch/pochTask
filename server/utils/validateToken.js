import jwt from "jsonwebtoken";
import { SECRET } from "../index.js";

const validateToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access Denied" });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded;
      next();
    } else {
      res.status(400).json({ error: "Invalid Token" });
    }
  });
};

export default validateToken;
