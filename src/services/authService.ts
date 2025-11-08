import jwt from "jsonwebtoken";

import ENV from "../utils/env";

const generateToken = (id: string, username: string): string => {
  const payload = { id, username };
  const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

const authService = {
  generateToken,
};

export default authService;
