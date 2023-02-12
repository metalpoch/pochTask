import { Router } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";;
import { SECRET } from "../index.js";
import { userLogin, createUser } from "../utils/auth.js";

const route = Router();

route.post("/signin", (req, res) => {
  const result = userLogin({ schema: Users, credentials: req.body });
  result
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { id: user.id, alias: user.alias, admin: user.admin },
          SECRET,
          { expiresIn: "1d" }
        );
        res.header("auth-token", token).json({ token });
      } else {
        res.status(404).json({ msg: "user or password invalid" });
      }
    })
    .catch((error) => res.status(400).json({ error }));
});

route.post("/signup", (req, res) => {
  const result = createUser({ schema: Users, credentials: req.body });
  result
    .then((msg) => res.status(201).json(msg))
    .catch((error) => res.status(400).json({ error: error.message }));
});

export default route;
