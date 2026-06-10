import express from 'express';
import { profileCustomerController } from '../../controller/profileCustomerController/profileCustomerController';
import upload from '../../utils/cloudinaryConfig'; 

const router = express.Router();

router.route('/:id').get(profileCustomerController.getProfileData);

// Actualizar datos del perfil (Se añade el middleware 'upload.single' si se sube la foto directo)
router.route('/update/:id').put(upload.single('image'), profileCustomerController.updateProfileData);

// Añadimos la sub-ruta para registrar las compras del cliente por su ID
router.route('/:id/purchases').post(profileCustomerController.addPurchase);
router.route('/:id/purchases').post(profileCustomerController.addPurchase);

// Eliminar una compra específica enviando su FAC-XXXXXX en la URL
router.route('/:id/purchases/:purchaseId').delete(profileCustomerController.deletePurchase);

export default router;