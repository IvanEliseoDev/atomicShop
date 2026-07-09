import express from 'express';
import { registerCustomerEcommerceController } from '../../../controller/customer/e-commerce/registerCustomerController';

const router = express.Router();

router.route('/').post(registerCustomerEcommerceController.register);
router.route('/verifyCodeEmail').post(registerCustomerEcommerceController.verifyCode);
router.route('/resendCode').post(registerCustomerEcommerceController.resendCode);

export default router;