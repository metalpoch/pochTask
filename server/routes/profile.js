import { Router } from "express";
import Users from "../models/Users.js";

const route = Router();

const getProfile = async ({ id, username, details }) => {
  id ??= false;
  details ??= false;
  return details && id
    ? await Users.findById(id).populate("Tasks Groups")
    : await Users.findOne({ username });
};

route.get("/", (req, res) => {
  const { id } = req.user;
  const result = getProfile({id, details: true});
  result
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error: error.message }));
});

route.get("/:username", (req, res) => {
  const username = req.params.username;
  const result = getProfile({username});
  result
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error: error.message }));
});


export default route;
