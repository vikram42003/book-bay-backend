import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  referralCode: string;
  credits: number;
  referrerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    credits: { type: Number, default: 0 },
    referrerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
