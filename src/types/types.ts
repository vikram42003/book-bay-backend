import { z } from "zod";

export const userZodSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  referralCode: z.string().length(8),
  credits: z.number().default(0),
  referrerId: z.string().optional(),
});

export type User = z.infer<typeof userZodSchema>;

export const referralZodSchema = z.object({
  referrerId: z.string(),
  referredUserId: z.string(),
  status: z.enum(["PENDING", "CONVERTED"]).default("PENDING"),
});

export type ReferralInput = z.infer<typeof referralZodSchema>;
