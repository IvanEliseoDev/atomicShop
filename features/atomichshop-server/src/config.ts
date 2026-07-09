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
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
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
