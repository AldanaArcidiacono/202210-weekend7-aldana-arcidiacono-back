import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interface/error';
import { RobotRepository } from '../repository/robots';
import { UsersRepository } from '../repository/users';
import { createToken, passwdValidate } from '../services/auth';
import { UsersController } from './users';

jest.mock('../services/auth');

const mockData = [
    { name: 'Pepe', role: 'Admin', id: '4as56d' },
    { name: 'Ernesto', role: 'user', id: 'a4sd8a' },
];

describe('Given the users controller,', () => {
    let repository: RobotRepository;
    let userRepo: UsersRepository;
    let userController: UsersController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        repository = RobotRepository.getInstance();
        userRepo = UsersRepository.getInstance();

        userRepo.post = jest.fn().mockResolvedValue(mockData[0]);
        userRepo.find = jest.fn().mockResolvedValue(mockData[0]);
        userController = new UsersController(userRepo, repository);

        req = {};
        res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        next = jest.fn();
    });

    describe('When we instantiate register(),', () => {
        test('It should create a new user', async () => {
            req.body = { mockData };
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ user: mockData[0] });
        });
    });

    describe('When we instantiate login()', () => {
        test('With an invalid password it should throw an error', async () => {
            const error: CustomError = new HTTPError(
                404,
                'Not found id',
                'message of error'
            );
            (passwdValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'password' };
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});

describe('Given the users controller, but everything goes wrong', () => {
    const error: CustomError = new HTTPError(
        404,
        'Not found id',
        'message of error'
    );
    const repository = RobotRepository.getInstance();
    const userRepo = UsersRepository.getInstance();

    userRepo.get = jest.fn().mockRejectedValue('User');
    userRepo.post = jest.fn().mockRejectedValue(['User']);
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

    describe('When we instantiate login()', () => {
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
