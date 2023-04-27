import express from "express";
import post from "./routes/post.js";
import user from "./routes/user.js";
import connect from "./utils/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/Error.js";
import cors from "cors";
import cloudinary from "cloudinary";
import path from "path";
import {fileURLToPath} from 'url'
dotenv.config({
  path: "./config/config.env",
});

const app = express();
const PORT = process.env.PORT || 8080;
connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  cors({
    extended: true,
  })
);


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use("/api/v1", post);
app.use("/api/v1", user);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Serving on http://localhost:${PORT}`);
});

app.use(errorMiddleware);
