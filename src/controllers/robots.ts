import { NextFunction, Request, Response } from 'express';
import { BasicData, Data } from '../repository/data.js';
import { RobotI } from '../entities/robots.js';
import { HTTPError } from '../interface/error.js';
import { ExtraRequest } from '../middleware/interceptor.js';
import { UserI } from '../entities/users.js';
import createDebug from 'debug';
const debug = createDebug('W7CH:controllers:robot');

export class RobotController {
    constructor(
        public repository: Data<RobotI>,
        public userRepo: BasicData<UserI>
    ) {
        debug('instance');
    }

    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getAll');
            const robots = await this.repository.getAll();
            resp.json({ robots });
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
            debug('get');
            const robots = await this.repository.get(req.params.id);
            res.json({ robots });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async post(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('post');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.userRepo.get(req.payload.id);
            req.body.owner = user.id;
            const robot = await this.repository.post(req.body);

            // repo user -> user + robot
            res.status(201).json({ robot });
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
            debug('patch');
            const robots = await this.repository.patch(req.params.id, req.body);
            res.json({ robots });
        } catch (error) {
            next(this.createHttpError(error as Error));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            debug('delete');
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
