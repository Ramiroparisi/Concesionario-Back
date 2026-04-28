import { Router } from 'express';
import { login, logout, verifyToken } from './auth.controller.js';
import { checkAuth } from './authMiddleware.js';

export const authRouter = Router();


authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/verify-token', checkAuth, verifyToken);