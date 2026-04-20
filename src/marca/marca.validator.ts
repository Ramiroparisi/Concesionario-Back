import {body} from 'express-validator'

export const validateMarca = [
  body('nombre')
    .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),
];