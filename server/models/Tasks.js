import { Schema, model } from "mongoose";

const AccomplishedSchema = new Schema(
  {
    success: { type: Boolean, default: false },
    comment: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const TaskSchema = new Schema(
  {
    originator: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    comment: { type: String },
    important: { type: Boolean, default: false },
    limitDate: { type: Date },
    liable: { type: Schema.Types.ObjectId, ref: "User"},
    accomplished: { type: [AccomplishedSchema] }
  },
  { timestamps: true, versionKey: false }
);

export default model("Tasks", TaskSchema);
