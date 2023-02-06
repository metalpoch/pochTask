import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    rank: { type: String, required: true },
    password: { type: String, required: true },
    hidden: { type: String, required: true },
    blocked: { type: String, default: false },
    avatar: { type: String, required: true }, // default https://robohash.org/<username>
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
  },
  { timestamps: true }
);

export default model("User", UserSchema);
