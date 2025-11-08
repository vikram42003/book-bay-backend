import jwt from "jsonwebtoken";

import ENV from "../utils/env";

const generateToken = (id: string, username: string): string => {
  const payload = { id, username };
  const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

const verifyToken = (token: string): { id: string; username: string } | null => {
  const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; username: string };
  return decoded;
};

const authService = {
  generateToken,
  verifyToken,
};

export default authService;
