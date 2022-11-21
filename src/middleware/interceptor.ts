import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interface/error.js';
import { verifyToken } from '../services/auth.js';

export interface ExtraRequest extends Request {
    payload: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const authString = req.get('Authorization');
    if (!authString || authString?.slice(1, 6) !== 'Bearer') {
        next(new HTTPError(403, 'Forbidden', 'Incorrect user or password')); //Te manda al middleware de errores
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = verifyToken(token);
        next();
    } catch (error) {
        next(new HTTPError(403, 'Forbidden', 'Incorrect user or password'));
    }
};
