import { z } from "zod";

// TODO: CHANGE ALL User to UserInput and UserResponse to just User

// Base response
// This type is for craeting database response variants of the below types
const baseResponseSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type BaseResponse = z.infer<typeof baseResponseSchema>;

// User
export const userZodSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  referralCode: z.string(),
  credits: z.number().default(0),
  referrerId: z.string().optional(),
});
export type User = z.infer<typeof userZodSchema>;

// UserResponse
export const userResponseZodSchema = userZodSchema.safeExtend(baseResponseSchema);
export type UserResponse = z.infer<typeof userResponseZodSchema>;

// Referral
export const referralZodSchema = z.object({
  referrerId: z.string(),
  referredUserId: z.string(),
  status: z.enum(["PENDING", "CONVERTED"]).default("PENDING"),
});
export type ReferralInput = z.infer<typeof referralZodSchema>;

// ReferralResponse
export const referralResponseZodSchema = referralZodSchema.safeExtend(baseResponseSchema);
export type ReferralResponse = z.infer<typeof referralResponseZodSchema>;

// Book
export const bookZodSchema = z.object({
  title: z.string(),
  image: z.string(),
  price: z.number().positive(),
});
export type BookInput = z.infer<typeof bookZodSchema>;

// BookResponse
export const bookResponseZodSchema = bookZodSchema.safeExtend(baseResponseSchema);
export type BookResponse = z.infer<typeof bookResponseZodSchema>;

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
