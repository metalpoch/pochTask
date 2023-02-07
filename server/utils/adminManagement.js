import bcryptjs from "bcryptjs";
import Users from "../models/Users.js";
import { SECRET_SALT } from "../index.js";

const createAdmin = async () => {
  const salt = parseInt(SECRET_SALT)
  const password = await bcryptjs.hash("admin", salt);
  return Users.insertMany(
    {
      firstname: "System",
      lastname: "Admin",
      alias: "Admin",
      username: "admin",
      password: password,
      avatar: "https://robohash.org/admin",
      hidden: true,
      rank: "admin",
    },
    { new: true }
  );
};

const adminManagement = async() => {
  const documents = await Users.estimatedDocumentCount()
  if(documents === 0) createAdmin()
}

export default adminManagement
