import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interface/error';
import { UsersRepository } from '../repository/users';
import { UsersController } from './users';

jest.mock('../repository/users');

const mockData = [
    {
        name: 'Pepe',
        email: 'pepe@gmail.com',
        password: 'pepe1234',
        role: 'Admin',
    },
    {
        name: 'Ernesto',
        email: 'ernest@gmail.com',
        password: '789ErnesT',
        role: 'Empleado',
    },
];

describe('Given the users controller,', () => {
    UsersRepository.prototype.get = jest.fn().mockResolvedValue(mockData);
    UsersRepository.prototype.post = jest.fn().mockResolvedValue(mockData[0]);

    const repository = new UsersRepository();
    const userController = new UsersController(repository);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate register(),', () => {
        test('It should create a new user', async () => {
            req.params = mockData[0];
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ user: mockData[0] });
        });
    });
});

describe('Given the users controller, but everything goes wrong', () => {
    let error: HTTPError;
    beforeEach(() => {
        error = new HTTPError(404, 'Not found id', 'message of error');
    });

    UsersRepository.prototype.get = jest.fn().mockRejectedValue(['Robot']);
    UsersRepository.prototype.post = jest.fn().mockRejectedValue(['Robot']);

    const repository = new UsersRepository();
    const userController = new UsersController(repository);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate get(),', () => {
        test('It should throw an error', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
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
