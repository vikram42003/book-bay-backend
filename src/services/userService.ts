import bcrypt from "bcrypt";
import { User, IUser } from "../models/User";

const getUserByReferralCode = async (referralCode: string): Promise<IUser | null> => {
  const user = await User.findOne({ referralCode });
  return user;
};

const createUser = async (username: string, password: string, referredByUser: IUser | null): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const referralCode = username + Math.floor(Math.random() * 10000);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    referralCode,
    referrerId: referredByUser ? referredByUser.id : undefined,
  });

  return newUser;
};

const userService = {
  getUserByReferralCode,
  createUser,
};

export default userService;
