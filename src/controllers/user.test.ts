import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interface/error';
import { RobotRepository } from '../repository/robots';
import { UsersRepository } from '../repository/users';
import { UsersController } from './users';

describe('Given the users controller, but everything goes wrong', () => {
    const error: CustomError = new HTTPError(
        404,
        'Not found id',
        'message of error'
    );

    UsersRepository.prototype.get = jest.fn().mockRejectedValue('User');
    UsersRepository.prototype.post = jest.fn().mockRejectedValue(['User']);

    const repository = RobotRepository.getInstance();
    const userRepo = UsersRepository.getInstance();
    const userController = new UsersController(userRepo, repository);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    test('Then if something went wrong register should throw an error', async () => {
        await userController.register(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    describe('When we instantiate post()', () => {
        test('It should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate createHttpError(),', () => {
        test('It should throw the correct message', async () => {
            error.message = 'Not found id';
            await userController.createHttpError(error);
            expect(error.message).toBe('Not found id');
        });
    });
});
