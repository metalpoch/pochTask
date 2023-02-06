import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import users from "./routes/users.js";
import tasks from "./routes/tasks.js";

config();
// Variables
const { NODE_ENV, PORT, HOST, SECRET } = process.env;
const DB = NODE_ENV === "development"
  ? process.env.DB_URI_DEV
  : process.env.DB_URI;

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(session({
  secret: SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl: DB})
}))
app.use("/api/users", users);
app.use("/api/tasks", tasks);

// Connection with Mongo Atlas
mongoose.set("strictQuery", false);
mongoose
  .connect(DB)
  .then(() => console.log("Connection with the database established"))
  .catch((error) => console.log({ error }));

app.listen(PORT, () => {
  console.log(`Started server on ${HOST}:${PORT}`);
});
