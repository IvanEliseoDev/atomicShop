import express from 'express';
import { brandsController } from '../../controller/brands/brands';
export const brandsRouter = express.Router()

brandsRouter.route("/").get(brandsController.getBrands)