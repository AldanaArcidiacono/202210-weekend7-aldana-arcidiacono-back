import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interface/error.js';
import { RobotRepository } from '../repository/robots.js';
import { verifyToken } from '../services/auth.js';

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
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
    const repo = new RobotRepository();
    try {
        const robot = await repo.get(req.params.id);
        if (robot.owner.toString() !== (req.payload as JwtPayload).id) {
            next(new HTTPError(403, 'Forbidden', 'Incorrect user or password'));
        }
        next();
    } catch (error) {
        next(error);
    }
};
