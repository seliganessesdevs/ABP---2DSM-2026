import express, { type Express } from "express";
import cors from "cors";
import routes from "./routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Express = express();

app.use(cors());
app.use(loggerMiddleware);
app.use(express.json({ limit: "10mb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, data: {} });
});

app.use("/api/v1", routes);

app.use(errorMiddleware);

export default app;
