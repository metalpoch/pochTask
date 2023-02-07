import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Users from "../models/Users.js";
import { SECRET } from "../index.js";

const route = Router();

const userLogin = async (username, password) => {
  const user = await Users.findOne({ username });
  if(!user) return false
  const checkPass = await bcryptjs.compare(password, user.password);
  return user && checkPass ? user : false;
};

route.post("/", (req, res) => {
  const { username, password } = req.body;
  const result = userLogin(username, password.toString());
  result
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { id: user.id, alias: user.alias, rank: user.rank },
          SECRET,
          { expiresIn: "15m" }
        );
        res.header("auth-token", token).json({ token });
      } else {
        res.status(404).json({ msg: "Usuario o contrase;a invalida" });
      }
    })
    .catch((error) => res.status(400).json({ error }));
});

export default route;
