import express from "express";
import dotenv from "dotenv";
import { connectMongodb } from "./src/config/db.js";
import routes from "./src/routes/router.js";
import cors from "cors";
import { apiLogger } from "./src/utils/apiLogger.js";
import { Port } from "./src/config/enverment.js";
import { globalErrorHandler } from "./src/errorHandler/globle.error.handler.js";

dotenv.config();
const app = express();
app.use(express.json());

// connect to mongodb
connectMongodb();

// app.get("/", async (req, res) => {
//   return res.api.create({
//     message: `Welcome to the AI Bot!`,
//   });
// });

app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(apiLogger);

app.use("/api/v1", routes);
app.use("/uploads", express.static("uploads"));

// server start
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
