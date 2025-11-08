import app from "./app";
import config from "./utils/env";
import { connectDB, closeDB } from "./config/mongodb";

// If the DB connection is successful only then start the express backend
connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
  });

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await closeDB();
  process.exit(0);
});
