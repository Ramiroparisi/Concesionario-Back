import {body} from 'express-validator'

export const validateModelo = [
  body('nombre')
    .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),
  
  body('cantPuertas')
    .isInt({ min: 0 }).withMessage('La cantidad de puertas debe ser un número entero no negativo.'),

  body('combustible')
    .isLength({ min: 2, max: 20 }).withMessage('El tipo de combustible debe tener entre 2 y 20 caracteres.'),
  
  body('motor')
    .isLength({ min: 2, max: 30 }).withMessage('El motor debe tener entre 2 y 30 caracteres.'),
  
  body('transmision')
    .isLength({ min: 2, max: 30 }).withMessage('La transmisión debe tener entre 2 y 30 caracteres.'),
];