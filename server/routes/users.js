import { Router } from "express";
import bcryptjs from "bcryptjs";
import Users from "../models/Users.js";
import { SECRET_SALT } from "../index.js";

const route = Router();

const getUsers = async (id) => {
  return id
    ? await Users.findById(id)
    : await Users.find()
};

const createUser = async (credentials) => {
  const salt = parseInt(SECRET_SALT)
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

route.get("/", (req, res) => {
  if(req.user.rank !== "admin") return res.status(401).json({error: "Access Denied"})
  const result = getUsers();
  result
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error }));
});

route.post("/signup", (req, res) => {
  if(req.user.rank !== "admin") return res.status(401).json({error: "Access Denied"})
  const result = createUser(req.body);
  result
    .then((msg) => res.status(201).json(msg))
    .catch((error) => res.status(400).json({ error: error.message }));
});

export default route;
