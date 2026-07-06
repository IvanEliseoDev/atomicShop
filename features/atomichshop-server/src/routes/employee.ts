import express from 'express';
import { employeeController } from '../controller/employee/employeeController';
import { validateEmployee } from '../middleware/validations/validateEmployee';
import { employeeAuthLogin } from '../auth/employee/employeeAuthLogin';
import { employeeAuthLogout } from '../auth/employee/employeeAuthLogOut';
import { employeeAuthCheckStatus } from '../auth/employee/employeeAuthCheckStatus';
import { verifyEmployeeToken } from '../middleware/auth/verifyEmployeeToken';

export const employeeRouter = express.Router()

employeeRouter.route("/login").post(employeeAuthLogin.loginEmployee)
employeeRouter.route("/logOut").get(employeeAuthLogout.logOut)
employeeRouter.route("/check-status").get(verifyEmployeeToken, employeeAuthCheckStatus.checkStatus)
employeeRouter.route("/verifyCode").post(employeeController.verifyCode)

employeeRouter.route("/")
  .get(verifyEmployeeToken, employeeController.getEmployees)
  .post(verifyEmployeeToken, validateEmployee, employeeController.addEmployee)

employeeRouter.route("/:id/toggle-status")
  .patch(verifyEmployeeToken, employeeController.toggleStatus)

employeeRouter.route("/:id")
  .get(verifyEmployeeToken, employeeController.getEmployeeByID)
  .put(verifyEmployeeToken, employeeController.updateEmployee)
  .delete(verifyEmployeeToken, employeeController.deleteEmployee)
