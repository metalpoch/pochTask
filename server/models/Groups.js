import { Schema, model } from "mongoose";

const MemberSchema = new Schema(
  {
    rank: { type: String, require: true },
    score: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    tasksFailed: { type: Number, default: 0 },
    muted: { type: Boolean, default: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const GroupSchema = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    members: { type: [MemberSchema] },
    leader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

export default model("Groups", GroupSchema);
