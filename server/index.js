import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import tasks from "./routes/tasks.js";
import validateToken from "./utils/validateToken.js"
import adminManagement from "./utils/adminManagement.js"


// create user: admin/admin
// to init
adminManagement()

config();
// Variables
const { NODE_ENV, PORT, HOST } = process.env;
export const { SECRET, SECRET_SALT } = process.env;

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
app.use("/api/auth", auth);
app.use("/api/users", validateToken, users);
app.use("/api/tasks", validateToken, tasks);

// Connection with Mongo Atlas
mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);
mongoose
  .connect(DB)
  .then(() => console.log("Connection with the database established"))
  .catch((error) => console.error({ error }));

app.listen(PORT, () => {
  console.log(`Started server on ${HOST}:${PORT}`);
});
