import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateFirstAdmin = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .withMessage("El nombre solo debe contener letras"),

  body("number_phone")
    .optional({ checkFalsy: true })
    .matches(/^[267]\d{3}-?\d{4}$/)
    .withMessage("Formato de teléfono inválido (ej: 7777-7777 o 77777777)"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido")
    .custom((value) => {
      if (
        !value.endsWith("@gmail.com") &&
        !value.endsWith("@ricaldone.edu.sv")
      ) {
        throw new Error(
          "Solo se permiten correos de @gmail.com o @ricaldone.edu.sv",
        );
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Error de validación",
        errors: errors.array().map((err) => ({
          field: err.type === "field" ? err.path : "unknown",
          message: err.msg,
        })),
      });
    }
    next();
  },
];
