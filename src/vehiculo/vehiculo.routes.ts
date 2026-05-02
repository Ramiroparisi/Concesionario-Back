import { Router } from 'express';
import { sanitizeVehiculoInput,findOne, findAll, add, update, remove } from './vehiculo.controller.js';
import { validateVehiculo } from './vehiculo.validator.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage: storage });
export const vehiculoRouter = Router();

vehiculoRouter.get('/', findAll);
vehiculoRouter.get('/:id', findOne);
vehiculoRouter.post('/', upload.array('fotos', 10), validateVehiculo, sanitizeVehiculoInput, add);
vehiculoRouter.put('/:id', upload.array('fotos', 10), validateVehiculo, sanitizeVehiculoInput, update);
vehiculoRouter.delete('/:id', remove);