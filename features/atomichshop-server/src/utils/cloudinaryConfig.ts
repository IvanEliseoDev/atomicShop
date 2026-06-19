import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../config";

//#1- Configuramos cloudinary con nuestras credenciales
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_key,
  api_secret: config.cloudinary.cloudinary_secret,
});

//#2- Como guardamos las imágenes
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "AtomicShop",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  } as Record<string, unknown>, 
});

//#3- Configuramos multer
const upload = multer({ storage });

export default upload;