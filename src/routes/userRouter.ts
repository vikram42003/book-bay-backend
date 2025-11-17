import { Router, IRouter, Request, Response } from "express";
import { mongo } from "mongoose";
import userService from "../services/userService";
import referralService from "../services/referralService";
import authService from "../services/authService";
import ENV from "../utils/env";
import extractUserFromTokenMiddleware from "../utils/extractUserFromTokenMiddleware";
import { IUser } from "../models/User";

const userRouter: IRouter = Router();

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// GET /api/users/me - get the current user's details
userRouter.get("/me", extractUserFromTokenMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Please try logging in again" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    const str = "Encountered an error While fetching users";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

// GET /api/users - get all users
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

// POST /api/users/register - creating a new account
// Takes - { username: string, password: string, referralCode?: string }
userRouter.post("/register", async (req: Request, res: Response) => {
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
      await referralService.createReferral(referredByUser, newUser);
    }

    // create the jwt token and return
    const token = authService.generateToken(newUser.id, newUser.username);
    res.status(201).json({ token: token, user: newUser });
  } catch (error) {
    // EDGE CASE - if the username already exists then mongoose will be the one to throw the error
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0] as string;
      const duplicateValue = error.keyValue[duplicateField];

      return res.status(409).json({
        error: `Duplicate ${duplicateField}`,
        message: `${duplicateField} "${duplicateValue}" already exists.`,
      });
    }

    const str = "Encountered an error While creating the user";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

// POST /api/users/login - to login
// Takes - { username: string, password: string }
userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await userService.loginUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = authService.generateToken(user.id, user.username);
    res.status(200).json({ token: token, user: user });
  } catch (error) {
    const str = "Encountered an error While logging in";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

// <DEV ONLY> - I created it for testing, Frontend should not have access to this
// DELETE /api/users/:id - deleting a user
userRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (ENV.NODE_ENV !== "development") {
      res.status(401).json({ error: "Unauthorized", message: "This route is for development only" });
    }

    // Just to make typescript quiet
    if (!req.params.id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    const str = "Encountered an error While deleting the user";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default userRouter;
