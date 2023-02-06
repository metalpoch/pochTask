import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Users from "../models/Users.js";
import { config } from "dotenv";

const route = Router();
config()
const secret = process.env.SECRET
const salt = parseInt(process.env.SECRET_SALT)

const getUsers = async (id) => {
  return id
    ? await Users.findById(id)
    : await Users.find()
};

const createUser = async (credentials) => {
  const { username, password, firstname, lastname, rank } = credentials;
  const parseUsername = username.toLowerCase()
  const avatar = `https://robohash.org/${username}`; // default avatar
  const hidden = rank === "admin" ? true : false
  const newPassword = await bcryptjs.hash(password.toString(), salt);
  return Users.insertMany(
    {
      username: parseUsername,
      password: newPassword,
      alias: username,
      firstname,
      lastname,
      avatar,
      hidden,
      rank,
    },
    { new: true }
  );
};

const userLogin = async (username, password) => {
  const user = await Users.findOne({ username });
  const credentials = {id: user._id, alias: user.alias}
  return user && await bcryptjs.compare(password, user.password)
    ? { _id: user._id, token: jwt.sign(credentials, secret) }
    : false;
};

route.get("/", (_, res) => {
  const result = getUsers();
  result
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error }));
});

route.get("/profile", (req, res) => {
  if (req.session._id) {
    const token = req.session.token
    const result = getUsers(req.session._id);
    result
      .then((data) => res.json({_id: data._id, alias: data.alias, token}))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ msg: "Usuario no conectado" });
  }
});

route.get("/logout", (req, res) => {
  if (!req.session._id) {
    res.json({ msg: "not user login" });
  } else {
    req.session.destroy((error) => {
      if (!error) {
        res.json({ msg: "user logout" });
      } else {
        res.status(400).json({ error });
      }
    });
  }
});

route.post("/signup", (req, res) => {
  const result = createUser(req.body);
  result
    .then((msg) => res.json(msg))
    .catch((error) => res.status(400).json({ error: error.message }));
});

route.post("/login", (req, res) => {
  const { username, password } = req.body;
  const result = userLogin(username, password.toString());
  result
    .then((data) => {
      if (data) {
        req.session._id = data._id;
        req.session.token = data.token;
        res.status(201).json({ msg: "Usuario conectado exitosamente" });
      } else {
        res.status(404).json({ msg: "Usuario o contrase;a invalida" });
      }
    })
    .catch((error) => res.status(400).json({ error }));
});

export default route;
