import { Schema, model } from "mongoose";
import { IRole } from "../types/role";

const Role = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String, required: false }],
  },
  { timestamps: true, minimize: false }
);

Role.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default model("Role", Role, "role");
