import { config } from "dotenv";
config({ path: "./config/config.env" });

import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
