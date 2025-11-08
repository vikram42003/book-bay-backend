import { z } from "zod";

// Base response
// This type is for craeting database response variants of the below types
const baseResponseSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type BaseResponse = z.infer<typeof baseResponseSchema>;

// UserInput
export const userInputZodSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  referralCode: z.string(),
  credits: z.number().default(0),
  referrerId: z.string().optional(),
});
export type UserInput = z.infer<typeof userInputZodSchema>;

// User
export const userZodSchema = userInputZodSchema.safeExtend(baseResponseSchema);
export type User = z.infer<typeof userZodSchema>;

// ReferralInput
export const referralInputZodSchema = z.object({
  referrerId: z.string(),
  referredUserId: z.string(),
  status: z.enum(["PENDING", "CONVERTED"]).default("PENDING"),
});
export type ReferralInput = z.infer<typeof referralInputZodSchema>;

// Referral
export const referralZodSchema = referralInputZodSchema.safeExtend(baseResponseSchema);
export type Referral = z.infer<typeof referralZodSchema>;

// BookInput
export const bookInputZodSchema = z.object({
  title: z.string(),
  image: z.string(),
  price: z.number().positive(),
});
export type BookInput = z.infer<typeof bookInputZodSchema>;

// Book
export const bookZodSchema = bookInputZodSchema.safeExtend(baseResponseSchema);
export type Book = z.infer<typeof bookZodSchema>;

// OrderInput
export const orderInputZodSchema = z.object({
  userId: z.string(),
  total: z.number().positive(),
  discount: z.number().default(0),
});
export type OrderInput = z.infer<typeof orderInputZodSchema>;

// Order
export const orderZodSchema = orderInputZodSchema.safeExtend(baseResponseSchema);
export type Order = z.infer<typeof orderZodSchema>;

// OrderItemInput
export const orderItemInputZodSchema = z.object({
  orderId: z.string(),
  bookId: z.string(),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.number().positive(),
});
export type OrderItemInput = z.infer<typeof orderItemZodSchema>;

// OrderItem
export const orderItemZodSchema = orderItemInputZodSchema.safeExtend(baseResponseSchema);
export type OrderItem = z.infer<typeof orderItemZodSchema>;
