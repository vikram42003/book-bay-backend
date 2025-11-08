import { User, IUser } from "../models/User";
import { Referral, IReferral } from "../models/Referral";

const createReferral = async (referrer: IUser, referredUser: IUser): Promise<IReferral> => {
  return await Referral.create({
    referrerId: referrer.id,
    referredUserId: referredUser.id,
  });
};

const referralServie = {
  createReferral,
};

export default referralServie;
