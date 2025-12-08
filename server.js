import express from "express";
import dotenv from "dotenv";
import { connectMongodb } from "./src/config/db.js";
import routes from "./src/routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());

// connect to mongodb
connectMongodb(process.env.MONGO_URL);

// app.get("/", async (req, res) => {
//   return res.api.create({
//     message: `Welcome to the AI Bot!`,
//   });
// });

app.use("/api/v1", routes);

// server start
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
