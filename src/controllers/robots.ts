import { NextFunction, Request, Response } from 'express';
import { BasicData, Data } from '../repository/data.js';
import { Robot } from '../entities/robots.js';
import { HTTPError } from '../interface/error.js';
import { ExtraRequest } from '../middleware/interceptor.js';
import { User } from '../entities/users.js';

export class RobotController {
    constructor(
        public repository: Data<Robot>,
        public userRepo: BasicData<User>
    ) {}

    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const robots = await this.repository.getAll();
            res.json({ robots });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const robots = await this.repository.get(req.params.id);
            res.json({ robots });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async post(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.userRepo.get(req.payload.id);
            req.body.owner = user.id;
            const robot = await this.repository.post(req.body);
            res.json({ robot });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async patch(req: Request, res: Response, next: NextFunction) {
        try {
            const robots = await this.repository.patch(req.params.id, req.body);
            res.json({ robots });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.repository.delete(req.params.id);
            res.json({ id: req.params.id });
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
