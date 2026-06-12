import dotenv from "dotenv";
import { getEnvVar } from "./utils/getEnvVar";

dotenv.config();

export const config = {
  db: {
    URI: getEnvVar("DB_URI"),
  },
  server: {
    PORT: process.env.PORT || "4000",
  },
  jwt: {
    secret: getEnvVar("JWT_SECRET"),
  },
  email: {
    user: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
  },
  cloudinary: {
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_secret: process.env.CLOUDINARY_API_SECRET,
  },
  wompi: {
    grant_type: process.env.WOMPI_GRANT_TYPE,
    audience: process.env.WOMPI_AUDIENCE,
    client_id: process.env.WOMPI_CLIENT_ID,
    client_secret: process.env.WOMPI_CLIENT_SECRET,
  },
};
