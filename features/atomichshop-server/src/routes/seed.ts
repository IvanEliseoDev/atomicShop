import express from 'express';
import { seedService } from '../seed/seedService';

export const seedRouter = express.Router()
seedRouter.route("/").get(seedService.seedExecute)