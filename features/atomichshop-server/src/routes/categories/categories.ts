import express from 'express';
import { categoryController } from '../../controller/categories/categories';
import router from '../product/e-commerce/products';

export const categoryRouter = express.Router()

categoryRouter.route("/").get(categoryController.getCategories).post(categoryController.createCategory)

categoryRouter.route("/:id").get(categoryController.getCategoryById).put(categoryController.updateCategory).delete(categoryController.deleteCategory)