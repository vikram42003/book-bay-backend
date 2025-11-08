import { User, IUser } from "../models/User";
import { Referral, IReferral } from "../models/Referral";

const createReferral = async (referrer: IUser, referredUser: IUser): Promise<IReferral> => {
  return await Referral.create({
    referrerId: referrer.id,
    referredUserId: referredUser.id,
  });
};

const claimReferral = async (user: IUser): Promise<IReferral | null> => {
  const referral = await Referral.findOne({ referredUserId: user.id, referrer: user.referrerId, status: "PENDING" });
  // Referral must have already been redeemed
  if (!referral) {
    await User.findByIdAndUpdate(user.id, { referralStatus: "CONVERTED" });
    return null;
  }

  // Current users first purchase bonus credited and set to CONVERTED so we dont double count
  await User.findByIdAndUpdate(user.id, { referralStatus: "CONVERTED", $inc: { credits: 2 } });
  // The user who referred them can take the bonus unlimited times from any of their referral users, so just increase
  await User.findByIdAndUpdate(user.referrerId, { $inc: { credits: 2 } });
  const newReferral = await Referral.findByIdAndUpdate(referral.id, { status: "CONVERTED" });
  return newReferral;
};

const referralServie = {
  createReferral,
  claimReferral,
};

export default referralServie;
