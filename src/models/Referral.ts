import { Schema, model, Document, Types } from "mongoose";

export interface IReferral extends Document {
  referrerId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  status: "PENDING" | "CONVERTED";
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referredUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    status: { type: String, enum: ["PENDING", "CONVERTED"], default: "PENDING" },
  },
  { timestamps: true }
);

// Composite unique constraint
// We need to make sure that the user A to user B referral only works 1 time for user A and B, so we create a compisite key out of the two unique foreign keys
referralSchema.index({ referrerId: 1, referredUserId: 1 }, { unique: true });

export const Referral = model<IReferral>("Referral", referralSchema);
