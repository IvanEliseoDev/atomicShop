import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateEmployee = [

    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/).withMessage('El nombre solo debe contener letras'),

    body('number_phone')
        .optional({ checkFalsy: true })
        .matches(/^[267]\d{3}-\d{4}$/).withMessage('Formato de teléfono inválido (ej: 7777-7777)'),

    body('direction')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5 }).withMessage('La dirección debe tener al menos 5 caracteres'),

    body('position')
        .trim()
        .notEmpty().withMessage('El cargo es obligatorio')
        .isIn(['Admin', 'Empleado']).withMessage('El cargo debe ser Admin o Empleado'),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo electrónico válido'),

    // Campos que el cliente no puede enviar
    body(['password', 'isVerified', 'isGenericPassword', 'loginAttemps', 'timeOut', 'payroll_month'])
        .custom((value) => {
            if (value !== undefined) {
                throw new Error('No tienes permisos para modificar este campo');
            }
            return true;
        }),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: "Error de validación",
                errors: errors.array().map(err => ({
                    field: err.type === 'field' ? err.path : 'unknown',
                    message: err.msg
                }))
            });
        }
        next();
    }
];
