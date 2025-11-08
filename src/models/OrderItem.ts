import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem extends Document {
  orderId: Types.ObjectId;
  bookId: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
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

export const OrderItem = model<IOrderItem>("OrderItem", orderItemSchema);
