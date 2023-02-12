import { Router } from "express";
import Users from "../models/Users.js";
import { createUser } from "../utils/auth.js";

const route = Router();

const getUsers = async (username) => {
  return username
    ? await Users.findOne({username}).populate("Tasks")
    : await Users.find().populate("Tasks")
};

route.get("/users", (req, res) => {
  const { username } = req.query;
  const { admin } = req.user;
  if (admin === "true") {
    const result = getUsers(username);
    result
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ error: error.message }));
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

route.post("/signup", (req, res) => {
  const result = createUser({
    schema: Users,
    credentials: req.body,
    admin: true,
  });
  result
    .then((msg) => res.status(201).json(msg))
    .catch((error) => res.status(400).json({ error: error.message }));
});

export default route;
