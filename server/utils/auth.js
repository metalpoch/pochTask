import bcryptjs from "bcryptjs";
import { SECRET_SALT } from "../index.js";

const userLogin = async ({schema, credentials}) => {
  const { username, password } = credentials;
  const user = await schema.findOne({ username });
  if (!user) return false;
  const checkPass = await bcryptjs.compare(password.toString(), user.password);
  return checkPass ? user : false;
};

const createUser = async ({schema, credentials, admin}) => {
  admin ??= false
  const salt = parseInt(SECRET_SALT);
  const { username, password, firstname, lastname, rank } = credentials;
  const parseUsername = username.toLowerCase();
  const avatar = `https://robohash.org/${username}`; // default avatar
  const hidden = admin ? true : false;
  const newPassword = await bcryptjs.hash(password.toString(), salt);
  return schema.insertMany(
    {
      username: parseUsername,
      password: newPassword,
      alias: username,
      firstname,
      lastname,
      avatar,
      hidden,
      rank,
      admin,
    },
    { new: true }
  );
};

export {userLogin, createUser}
