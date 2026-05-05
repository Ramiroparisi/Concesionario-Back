import request from 'supertest';
import { app } from '../app.js';

describe('Integración Mockeada: GET /api/marcas', () => {
  let originalEm: any;

  beforeAll(() => {
    originalEm = app.locals.em;
    app.locals.em = {
      fork: () => ({
        find: jest.fn().mockResolvedValue([{ id: 99, nombre: 'MarcaFantasma' }])
      })
    };
  });

  afterAll(() => {
    app.locals.em = originalEm; 
  });

  it('debería devolver la marca fantasma inyectada', async () => {
    const response = await request(app).get('/api/marcas');

    expect(response.status).toBe(200);
    expect(response.body.data[0].nombre).toBe('MarcaFantasma');
    expect(response.body.data[0].id).toBe(99);
  });
});