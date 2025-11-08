import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";

interface AuthenticatedRequest extends Request {
  user?: { id: string; username: string };
}

const extractUserFromTokenMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

  req.user = token;

  next();
};

export default extractUserFromTokenMiddleware;
