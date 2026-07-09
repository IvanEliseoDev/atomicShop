import { Request, Response } from "express";
import { employeeModel } from "../../models/employee";

export const employeeAuthCheckStatus = {
  checkStatus: async (req: Request, res: Response) => {
    try {
      const employeeId = (req as any).user.id;
      const employee = await employeeModel
        .findById(employeeId)
        .select("-password");
      if (!employee) {
        return res
          .status(404)
          .json({ status: 404, message: "Empleado no encontrado", data: null });
      }
      if (!employee.isVerified) {
        return res
          .status(403)
          .json({ status: 403, message: "Tu cuenta ha sido deshabilitada. Contacta al administrador.", data: null });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Sesión activa", data: employee });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          status: 500,
          message: "Error al verificar estado",
          data: null,
        });
    }
  },
};
