import { Router } from "express";
import { sendContactEmail } from "../controller/contactController";

const router = Router();

router.post("/", sendContactEmail);

export default router;