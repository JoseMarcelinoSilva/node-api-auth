import express from "express";
import mainRoutes from "./routes/main.js";
import authRoutes from "./routes/auth.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/", mainRoutes);

  return app;
}
