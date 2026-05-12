import express from 'express';
import { employeeController } from '../controller/employee/employeeController';
import { validateEmployee } from '../middleware/validations/validateEmployee';
import { employeeAuthLogin } from '../auth/employee/employeeAuthLogin';
import { employeeAuthLogout } from '../auth/employee/employeeAuthLogOut';
import { employeeAuthCheckStatus } from '../auth/employee/employeeAuthCheckStatus';
import { verifyEmployeeToken } from '../middleware/auth/verifyEmployeeToken';

export const employeeRouter = express.Router()

employeeRouter.route("/")
.get(employeeController.getEmployees)
.post(validateEmployee, employeeController.addEmployee)

employeeRouter.route("/:id").delete(employeeController.deleteEmployee)

employeeRouter.route("/verifyCode").post(employeeController.verifyCode)

employeeRouter.route("/login").post(employeeAuthLogin.loginEmployee)
employeeRouter.route("/logOut").get(employeeAuthLogout.logOut)
employeeRouter.route("/check-status").get(verifyEmployeeToken, employeeAuthCheckStatus.checkStatus)


