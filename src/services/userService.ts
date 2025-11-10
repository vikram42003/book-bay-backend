import bcrypt from "bcrypt";
import { User, IUser } from "../models/User";

const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id);
  return user;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await User.find({});
  return users;
};

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

const loginUser = async (username: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }
  const isThePasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isThePasswordCorrect) {
    return null;
  } else {
    return user;
  }
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

const userService = {
  getUserById,
  getUserByReferralCode,
  getAllUsers,
  createUser,
  deleteUser,
  loginUser,
};

export default userService;
