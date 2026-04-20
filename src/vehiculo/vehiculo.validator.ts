import {body} from 'express-validator'

export const validateVehiculo = [
  body('kilometraje')
    .isInt({ min: 0 }).withMessage('El kilometraje debe ser un número entero positivo.')
    .notEmpty().withMessage('El kilometraje no puede estar vacío.'),

  body('anio')
    .isInt({ min: 1950, max:3000 }).withMessage('El año debe ser un número entero positivo.')
    .notEmpty().withMessage('El año no puede estar vacío.'),

  body('patente') //Poner cartel en el front avisando si un auto no está patentado
    .isLength({ min: 0, max: 12 }).withMessage('La patente debe tener entre 0 y 12 caracteres.')
    .notEmpty().withMessage('La patente no puede estar vacía.'),

  body('color')
    .isLength({ min: 2, max: 30 }).withMessage('El color debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El color no puede estar vacío.'),

  body('descripcion')
    .isLength({ min: 10, max: 500 }).withMessage('La descripción debe tener entre 10 y 500 caracteres.')
    .notEmpty().withMessage('La descripción no puede estar vacía.'),

  body('precio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número decimal positivo.')
    .notEmpty().withMessage('El precio no puede estar vacío.'), 
 
  body('estado')
    .isIn(['disponible', 'vendido', 'reservado']).withMessage('El estado debe ser "disponible", "vendido" o "reservado".')
    .notEmpty().withMessage('El estado no puede estar vacío.'),
  
]