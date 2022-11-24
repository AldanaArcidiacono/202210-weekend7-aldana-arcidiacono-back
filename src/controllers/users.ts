import { NextFunction, Request, Response } from 'express';
import { RobotI } from '../entities/robots.js';
import { UserI } from '../entities/users.js';
import { HTTPError } from '../interface/error.js';
import { BasicData, Data } from '../repository/data.js';
import { createToken, passwdValidate } from '../services/auth.js';
import createDebug from 'debug';
const debug = createDebug('W7CH:controllers:user');

export class UsersController {
    constructor(
        public readonly repository: BasicData<UserI>,
        public readonly robotRepo: Data<RobotI>
    ) {
        debug('instance');
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.repository.post(req.body);
            res.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            debug('login', req.body.name);
            const user = await this.repository.find({ name: req.body.name });
            const isPasswdValid = await passwdValidate(
                req.body.password,
                user.password
            );
            if (!isPasswdValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                role: user.role,
            });
            res.json({ token });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
