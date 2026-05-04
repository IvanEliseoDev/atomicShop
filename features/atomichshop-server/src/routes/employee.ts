import express from 'express';
import { employeeController } from '../controller/employee/employeeController';
import { validateEmployee } from '../middleware/validations/validateEmployee';

export const employeeRouter = express.Router()

employeeRouter.route("/")
.get(employeeController.getEmployees)
.post(validateEmployee, employeeController.addEmployee)

employeeRouter.route("/:id").delete(employeeController.deleteEmployee)

employeeRouter.route("/verifyCode").post(employeeController.verifyCode)