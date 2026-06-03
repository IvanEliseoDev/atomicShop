import express from 'express';
import { profileCustomerController } from '../../controller/profileCustomerController/profileCustomerController';
import upload from '../../utils/cloudinaryConfig'; 

const router = express.Router();

router.route('/:id').get(profileCustomerController.getProfileData);

// Actualizar datos del perfil (Se añade el middleware 'upload.single' si se sube la foto directo)
router.route('/update/:id').put(upload.single('image'), profileCustomerController.updateProfileData);

export default router;