import express, { Express } from "express";

import logger from "./utils/logger.js";

const app: Express = express();

app.use(logger);

// Unknown route endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Unknown route" });
});

export default app;
