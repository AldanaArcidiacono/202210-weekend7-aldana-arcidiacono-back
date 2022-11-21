import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/users.js';
import { HTTPError } from '../interface/error.js';
import { BasicData } from '../repository/data.js';
import { createToken, passwdValidate } from '../services/auth.js';

export class UsersController {
    constructor(public repository: BasicData<User>) {
        //
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.post(req.body);
            res.json({ user });
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
            const user = await this.repository.findOne({ name: req.body.name });
            const isPasswdValid = await passwdValidate(
                req.body.password,
                user.password
            );
            if (!isPasswdValid) throw new Error('Wrong password');
            const token = createToken({ userName: user.name });
            res.json({ token });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
