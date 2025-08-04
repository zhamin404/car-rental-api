import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { UserRole } from "./user.constats";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  favoriteCarsId: Array<ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CLIENT,
    },
    favoriteCarsId: {
      type: [Schema.Types.ObjectId],
      ref: "Car",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserToken = "User";
export const UserModel = mongoose.model<User>(UserToken, UserSchema);
