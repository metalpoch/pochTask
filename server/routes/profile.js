import { Router } from "express";
import Users from "../models/Users.js";

const route = Router();

const getProfile = async ({ id, username, details, hidden }) => {
  id ??= false;
  details ??= false;
  return details && id
    ? await Users.findById(id, hidden).populate("Tasks Groups")
    : await Users.findOne({ username }, hidden);
};

route.get("/", (req, res) => {
  const { id } = req.user;
  const hidden = {
    _id: 0,
    password: 0,
    admin: 0,
    hidden: 0,
    username: 0,
  };
  const result = getProfile({id, hidden, details: true});
  result
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error: error.message }));
});

route.get("/:alias", (req, res) => {
  const username = req.params.alias.toLowerCase();
  const hidden = {
    _id: 0,
    password: 0,
    tasks: 0,
    admin: 0,
    hidden: 0,
    username: 0,
  };
  const result = getProfile({username, hidden});
  result
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error: error.message }));
});

export default route;
