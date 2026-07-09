import express from "express"
import { validateFirstAdmin } from "../middleware/validations/validateFirstAdmin";
import { firstAdminController } from "../controller/employee/firstAdminController";

export const adminRouter = express.Router()

adminRouter
  .route("/first-admin")
  .post(validateFirstAdmin, firstAdminController.registerFirstAdmin);