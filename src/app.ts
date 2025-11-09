import express, { Express } from "express";
import cors from "cors";

import logger from "./utils/logger.js";
import extractUserFromTokenMiddleware from "./utils/extractUserFromTokenMiddleware.js";

import bookRouter from "./routes/bookRoute.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRoute.js";
import referralRouter from "./routes/referralRouter.js";

const app: Express = express();

// Middlewares
// Cors has * as allow rules since this is only an assignment app
app.use(cors());
app.use(express.json());
app.use(logger);

// Routers
app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", extractUserFromTokenMiddleware, orderRouter);
app.use("/api/referrals", referralRouter);

// Unknown route endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Unknown route" });
});

export default app;
