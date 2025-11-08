import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import userService from "../services/userService";
import { IUser } from "../models/User";

interface AuthenticatedRequest extends Request {
  user: IUser;
}

const extractUserFromTokenMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized", message: "No token found. Please try logging in again" });
  }

  const rawToken = authHeader.split(" ")[1];
  if (!rawToken) {
    return res.status(401).json({ error: "Unauthorized", message: "No token found. Please try logging in again" });
  }

  const token = authService.verifyToken(rawToken);
  if (!token || !token?.id || !token?.username) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid token. Please try logging in again" });
  }

  const user = await userService.getUserById(token.id);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid token. Please try logging in again" });
  }

  req.user = user;

  next();
};

export default extractUserFromTokenMiddleware;
