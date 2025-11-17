import { User, IUser } from "../models/User";
import { Referral, IReferral } from "../models/Referral";
import mongoose from "mongoose";

const createReferral = async (referrer: IUser, referredUser: IUser): Promise<IReferral> => {
  return await Referral.create({
    referrerId: referrer.id,
    referredUserId: referredUser.id,
  });
};

const claimReferral = async (user: IUser): Promise<IReferral | null> => {
  // Use a database transaction for atomic update complying with ACID
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const referral = await Referral.findOne(
        {
          referredUserId: user.id,
          referrerId: user.referrerId,
          status: "PENDING",
        },
        null,
        { session }
      );

      if (!referral) {
        await User.findByIdAndUpdate(user.id, { referralStatus: "CONVERTED" }, { session });
        return null;
      }

      await User.findByIdAndUpdate(user.id, { referralStatus: "CONVERTED", $inc: { credits: 2 } }, { session });

      await User.findByIdAndUpdate(user.referrerId, { $inc: { credits: 2 } }, { session });

      const newReferral = await Referral.findByIdAndUpdate(
        referral.id,
        { status: "CONVERTED" },
        { session, new: true }
      );

      return newReferral;
    });
    return result;
  } catch (error) {
    console.error("Referral claim transaction failed:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllReferralsByReferrerId = async (referrerId: string): Promise<IReferral[]> => {
  return await Referral.find({ referrerId });
};

const referralService = {
  createReferral,
  claimReferral,
  getAllReferralsByReferrerId,
};

export default referralService;
