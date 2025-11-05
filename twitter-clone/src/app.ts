import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/auth.route";
import sessionRoute from "./routes/session.route";
import cookieParser from "cookie-parser";
import authenticate from "./middlewares/auth.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.get("/health", authenticate, (req, res) => {
    res.json({ok : true});
});

app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoute);
app.use(errorHandler);

export default app;