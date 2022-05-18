import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const User = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    username: { type: String, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  { timestamps: true, minimize: false }
);

User.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default model("User", User, "user");
