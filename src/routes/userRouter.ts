import { Router, IRouter, Request, Response } from "express";
import userService from "../services/userService";
import referralServie from "../services/referralService";
import authService from "../services/authService";

const userRouter: IRouter = Router();

// GET /api/auth - get all users
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    const str = "Encountered an error While fetching users";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

// POST /api/auth - creating a new account
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password, referralCode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    } else if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // If a referral code is attached, it must be a valid one
    // If thats the case then get the relevant user
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await userService.getUserByReferralCode(referralCode);
      if (!referredByUser) {
        return res.status(400).json({ error: "Invalid referral code" });
      }
    }

    // Create a new user
    const newUser = await userService.createUser(username, password, referredByUser);

    // If referral code was correct, then create a referral item, so that we can do the credit both users logic
    if (referredByUser) {
      await referralServie.createReferral(newUser, referredByUser);
    }

    // create the jwt token and return
    const token = authService.generateToken(newUser.id, newUser.username);
    res.status(201).json({ token: token, user: newUser });
  } catch (error) {
    const str = "Encountered an error While creating the user";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default userRouter;
