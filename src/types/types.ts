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
  referralStatus: z.enum(["PENDING", "CONVERTED"]).default("PENDING"),
  credits: z.number().default(0),
  referrerId: z.string().optional(),
});
export type UserInput = z.infer<typeof userInputZodSchema>;

// User
export const userZodSchema = userInputZodSchema.safeExtend(baseResponseSchema.shape);
export type UserType = z.infer<typeof userZodSchema>;

// ReferralInput
export const referralInputZodSchema = z.object({
  referrerId: z.string(),
  referredUserId: z.string(),
  status: z.enum(["PENDING", "CONVERTED"]).default("PENDING"),
});
export type ReferralInput = z.infer<typeof referralInputZodSchema>;

// Referral
export const referralZodSchema = referralInputZodSchema.safeExtend(baseResponseSchema.shape);
export type ReferralType = z.infer<typeof referralZodSchema>;

// BookInput
export const bookInputZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  image: z.string(),
  price: z.number().positive(),
});
export type BookInput = z.infer<typeof bookInputZodSchema>;

// Book
export const bookZodSchema = bookInputZodSchema.safeExtend(baseResponseSchema.shape);
export type BookType = z.infer<typeof bookZodSchema>;

// OrderItemInput
export const orderItemInputZodSchema = z.object({
  bookId: z.string(),
  quantity: z.number().int().positive(),
});
export type OrderItemInput = z.infer<typeof orderItemZodSchema>;

// OrderItem
export const orderItemZodSchema = z.object({
  ...baseResponseSchema.shape,
  ...orderItemInputZodSchema.shape,
  orderId: z.string(),
  priceAtPurchase: z.number().positive(),
});
export type OrderItemType = z.infer<typeof orderItemZodSchema>;

// OrderInput
export const orderInputZodSchema = z.object({
  userId: z.string(),
  total: z.number().positive(),
  discount: z.number().default(0),
});
export type OrderInput = z.infer<typeof orderInputZodSchema>;

// Order
export const orderZodSchema = orderInputZodSchema.safeExtend({
  ...baseResponseSchema.shape,
  // For virtual ref field (equivalent to joins query)
  orderItems: z.array(orderItemZodSchema).optional(),
});
export type OrderType = z.infer<typeof orderZodSchema>;
