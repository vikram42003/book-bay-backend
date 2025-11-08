import { Schema, model, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  image?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
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

export const Book = model<IBook>("Book", bookSchema);
