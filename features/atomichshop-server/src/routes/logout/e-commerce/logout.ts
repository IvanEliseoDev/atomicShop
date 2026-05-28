import express from 'express';
import { logoutEcommerceController } from '../../../controller/logout/e-commerce/logout';

const router = express.Router();

router.route('/').post(logoutEcommerceController.logout);

export default router;