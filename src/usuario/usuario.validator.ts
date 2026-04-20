import {body} from 'express-validator'

export const validateUsuario = [
  body('mail')
    .isLength({ min: 2, max: 35 }).withMessage('El mail debe tener entre 2 y 35 caracteres.')
    .notEmpty().withMessage('El mail no puede estar vacío.')
    .isEmail().withMessage('El mail debe ser una dirección de correo electrónico válida.'),

  body('contrasena')
    .isLength({ min: 8, max: 100 }).withMessage('La contraseña debe tener entre 8 y 100 caracteres.')
    .isUppercase().withMessage('La contraseña debe contener al menos una letra mayúscula.')
    .isLowercase().withMessage('La contraseña debe contener al menos una letra minúscula.')
    .isNumeric().withMessage('La contraseña debe contener al menos un número.')
    .notEmpty().withMessage('La contraseña no puede estar vacía.'),  

  body('nombre')
    .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),
  
  body('apellido')
    .isLength({ min: 2, max: 30 }).withMessage('El apellido debe tener entre 2 y 30 caracteres.')
    .notEmpty().withMessage('El apellido no puede estar vacío.'),

  body('telefono')
    .isInt({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos.')
    .notEmpty().withMessage('El teléfono no puede estar vacío.'),

  body('rol')
     .isIn(['admin', 'user']).withMessage('El rol debe ser "admin" o "user".')
     .notEmpty().withMessage('El rol no puede estar vacío.'), 
]