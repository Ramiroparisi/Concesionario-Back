import { Request, Response } from 'express';
import { findAll } from './marca.controller'; 
import { Marca } from './marca.entity';

describe('Unitario: Marca Controller', () => {
  it('debería retornar un array de marcas mockeadas con status 200', async () => {
    const marcasFalsas = [
      { id: 1, nombre: 'BMW' },
      { id: 2, nombre: 'Audi' }
    ];

    const mockEntityManager = {
      find: jest.fn().mockResolvedValue(marcasFalsas)
    };

    const mockReq = {
      app: { locals: { em: { fork: () => mockEntityManager } } }
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await findAll(mockReq, mockRes);

    expect(mockEntityManager.find).toHaveBeenCalledWith(Marca);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: marcasFalsas })); 
  });
});