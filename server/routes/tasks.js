import { Router } from "express";
import Tasks from "../models/Tasks.js";

const route = Router();

const getTasks = async () => {
  return await Tasks.find();
};

route.get("/", (_, res) => {
  const result = getTasks();
  result
    .then((res) => res.json())
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ error }));
});

export default route;
