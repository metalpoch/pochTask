import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, require: true },
    comment: { type: String, require: true },
    important: { type: Boolean, require: true },
    accomplished: { type: Boolean, require: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

export default model("Tasks", TaskSchema);
