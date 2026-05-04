import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateEmployee = [

    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).withMessage('El nombre solo debe contener letras'),

    body('dui')
        .trim()
        .notEmpty().withMessage('El DUI es obligatorio')
        .matches(/^\d{8}-\d{1}$/).withMessage('Formato de DUI inválido (ej: 00000000-0)'),

    body('birthDay')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (debe ser YYYY-MM-DD)'),

    body('number_phone')
        .optional({ checkFalsy: true })
        .matches(/^[267]\d{3}-\d{4}$/).withMessage('Formato de teléfono inválido (ej: 7777-7777)'),

    body('afp_affiliated')
        .optional({ checkFalsy: true })
        .isAlphanumeric().withMessage('El código AFP debe ser alfanumérico'),

    body('isss')
        .optional({ checkFalsy: true })
        .matches(/^\d{9}$/).withMessage('El ISSS debe tener exactamente 9 dígitos numéricos'),

    body(['direction', 'position', 'payroll_month'])
        .trim()
        .notEmpty().withMessage('Este campo es obligatorio'),

    body('salary')
        .notEmpty().withMessage('El salario es obligatorio')
        .isFloat({ min: 0.01 }).withMessage('El salario debe ser un número mayor a 0'),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .custom((value) => {
            if (!value.endsWith('@gmail.com') && !value.endsWith('@ricaldone.edu.sv') ) {
                throw new Error('Solo se permiten correos de @gmail.com');
            }
            return true;
        }),

    body('dui_img')
        .optional({ checkFalsy: true })
        .isString().withMessage('La imagen debe ser una ruta de texto válida'),

    // BLOQUEO DE SEGURIDAD: Impedir que el cliente envíe estos campos
    body(['password', 'isVerified', 'isGenericPassword', 'loginAttemps', 'timeOut'])
        .custom((value) => {
            if (value !== undefined) {
                throw new Error('No tienes permisos para modificar campos de seguridad internos');
            }
            return true;
        }),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: "Error de validación",
                errors: errors.array().map(err => ({ field: err.type === 'field' ? err.path : 'unknown', message: err.msg }))
            });
        }
        next();
    }
];