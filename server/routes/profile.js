import { Router } from "express";
import Users from "../models/Users.js";

const route = Router();

const getUsers = async (id) => {
  return await Users.findById(id).populate("Tasks")
};

route.get("/", (req, res) => {
  const { id } = req.user;
  if (id) {
    const result = getUsers(id);
    result
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ error: error.message }));
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

export default route;
