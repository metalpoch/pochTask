import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    rank: { type: String, required: true },
    admin: { type: String, default: false },
    password: { type: String, required: true },
    hidden: { type: String, required: true },
    blocked: { type: String, default: false },
    avatar: { type: String, required: true }, // default https://robohash.org/<username>
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Groups",
      },
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default model("User", UserSchema);
