import express from 'express';
import { recoveryPasswordEcommerceController } from '../../../controller/recoveryPassword/e-commerce/recoveryPassword';

const router = express.Router();

router.route('/requestCode').post(recoveryPasswordEcommerceController.requestCode);
router.route('/verifyCode').post(recoveryPasswordEcommerceController.verifyCode);
router.route('/newPassword').post(recoveryPasswordEcommerceController.newPassword);

export default router;