import { Router, IRouter } from "express";
import userService from "../services/userService";
import referralServie from "../services/referralService";
import authService from "../services/authService";

const userRouter: IRouter = Router();

// GET /api/auth - get all users
userRouter.get("/", async (req, res) => {
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
userRouter.post("/", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    } else if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    let referredByUser = null;
    if (referralCode) {
      referredByUser = await userService.getUserByReferralCode(referralCode);
      if (!referredByUser) {
        return res.status(400).json({ error: "Invalid referral code" });
      }
    }

    const newUser = await userService.createUser(username, password, referredByUser);

    if (referredByUser) {
      await referralServie.createReferral(newUser, referredByUser);
    }

    const token = authService.generateToken(newUser.id, newUser.username);

    res.status(201).json({ token: token, user: newUser });
  } catch (error) {
    const str = "Encountered an error While creating the user";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default userRouter;
