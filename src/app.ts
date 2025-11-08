import express, { Express } from "express";
import cors from "cors";

import logger from "./utils/logger.js";

import bookRouter from "./routes/bookRoute.js";

const app: Express = express();

// Middlewares
// Cors has * as allow rules since this is only an assignment app
app.use(cors());

app.use(express.json());
app.use(logger);

app.use("/api/books", bookRouter);

// Unknown route endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Unknown route" });
});

export default app;
