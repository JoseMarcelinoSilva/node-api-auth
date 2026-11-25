import express from "express";
import mainRoutes from "./routes/main.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/", mainRoutes);

  return app;
}
