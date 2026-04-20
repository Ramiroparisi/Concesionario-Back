import {body} from 'express-validator'

export const validateMultimedia = [
  body('archivo')
    .isLength({ min: 2, max: 30 }).withMessage('El nombre del archivo debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El nombre del archivo no puede estar vacío.'),
  
  body('orden')
    .isInt({ min: 0 }).withMessage('El orden debe ser un número entero no negativo.'),
];