import {body} from 'express-validator'

export const validateReserva = [
  body('nombreCli')
    .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),
  
  body('apellidoCli')
    .isLength({ min: 2, max: 30 }).withMessage('El apellido debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El apellido no puede estar vacío.'),
  
    body('dni')
    .isInt({ min: 0, max: 12 }).withMessage('El DNI debe ser un número entero no negativo.')
    .notEmpty().withMessage('El DNI no puede estar vacío.'),

  body('mail')
    .isLength({ min: 2, max: 35 }).withMessage('El mail debe tener entre 2 y 35 caracteres.')
    .notEmpty().withMessage('El mail no puede estar vacío.')
    .isEmail().withMessage('El mail debe ser una dirección de correo electrónico válida.'),

  body('telefono')
    .isInt({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos.')
    .notEmpty().withMessage('El teléfono no puede estar vacío.'),
  
  body('importe')
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número decimal no negativo.')
    .notEmpty().withMessage('El importe no puede estar vacío.'),

  body('fechaCreacion')
     .isDate().withMessage('La fecha de reserva debe ser una fecha válida.')
     .notEmpty().withMessage('La fecha de reserva no puede estar vacía.'), 
];