import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interface/error.js';
import { RobotRepository } from '../repository/robots.js';
import { verifyToken } from '../services/auth.js';
import createDebug from 'debug';
const debug = createDebug('W7CH:middlewares:interceptors');

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('logged');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(new HTTPError(403, 'Forbidden', 'Incorrect user or password'));
        return;
    }
    try {
        const token = authString.slice(7);
        verifyToken(token);
        req.payload = verifyToken(token);
        next();
    } catch (error) {
        next(new HTTPError(403, 'Forbidden', 'Incorrect user or password'));
    }
};

export const who = async (
    req: ExtraRequest,
    _res: Response,
    next: NextFunction
) => {
    debug('who');
    const repo = RobotRepository.getInstance();
    try {
        const robot = await repo.get(req.params.id);
        if (req.payload && robot.owner._id.toString() !== req.payload.id) {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};
