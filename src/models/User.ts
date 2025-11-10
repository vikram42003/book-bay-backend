import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  referralCode: string;
  credits: number;
  referrerId?: Types.ObjectId;
  referralStatus?: "PENDING" | "CONVERTED";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referralStatus: { type: String, enum: ["PENDING", "CONVERTED"], default: "PENDING" },
    credits: { type: Number, default: 0 },
    referrerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = (ret._id as Types.ObjectId).toString();
        delete ret._id;
        // Delete password from the user at the json transformation level, so it will never 
        // be on the user for any data that leaves the server
        delete (ret as { password?: string }).password;
      },
    },
  }
);

export const User = model<IUser>("User", userSchema);
