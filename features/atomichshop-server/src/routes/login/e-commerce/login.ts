import express from 'express';
import { loginEcommerceController } from '../../../controller/login/e-commerce/login';

const router = express.Router();

router.route('/').post(loginEcommerceController.login);
router.route('/me').get(loginEcommerceController.me);

export default router;