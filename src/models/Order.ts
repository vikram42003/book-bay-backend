import { Schema, model, Document, Types } from "mongoose";
import { IOrderItem } from "./OrderItem";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  total: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: Types.DocumentArray<IOrderItem>;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = (ret._id as Types.ObjectId).toString();
        delete ret._id;
      },
    },
  }
);

// virtual populate for orderItems (literally basically a joins query)
// doc ref - https://mongoosejs.com/docs/tutorials/virtuals.html#populate
orderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "orderId",
});

export const Order = model<IOrder>("Order", orderSchema);
