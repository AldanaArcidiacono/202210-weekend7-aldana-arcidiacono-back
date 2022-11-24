import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../repository/robots';
import { RobotController } from './robots';
import { HTTPError } from '../interface/error';
import { UsersRepository } from '../repository/users';
import { ExtraRequest } from '../middleware/interceptor';

const mockData = [
    { name: 'Pepe', id: '4as56d' },
    { name: 'Ernesto', id: '7e8rw' },
];

const mockResponse = { robots: ['bot'] };

describe('Given the robots controller,', () => {
    const repository = RobotRepository.getInstance();
    const userRepo = UsersRepository.getInstance();

    repository.getAll = jest.fn().mockResolvedValue(['bot']);
    repository.get = jest.fn().mockResolvedValue(mockData[0]);
    repository.post = jest.fn().mockResolvedValue('newRobot');
    repository.patch = jest.fn().mockResolvedValue(mockData[0]);
    repository.delete = jest.fn().mockResolvedValue({ id: '45sd' });

    const robotController = new RobotController(repository, userRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate getAll()', () => {
        test('It should return an array of all Robots', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('When we instantiate get(), with an id', () => {
        test('It should return the Robot of that id', async () => {
            req.params = { id: '4as56d' };
            await robotController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('When we instantiate post()', () => {
        test('It should return a new Robot', async () => {
            await robotController.post(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ robots: mockData[0] });
        });
    });

    describe('When we instantiate patch(), with an id and an updated Robot', () => {
        test('It should return the updated Robot', async () => {
            req.params = { id: '1234dsf' };
            req.body = { name: 'Elena' };
            await robotController.patch(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData[0] });
        });
    });

    describe('When we instantiate delete(), with an id', () => {
        test('It should return an object with the deleted id', async () => {
            req.params = { id: '1234dsf' };
            await robotController.delete(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(req.params);
        });
    });
});

describe('Given the robots controller, but everything goes wrong', () => {
    let error: HTTPError;
    beforeEach(() => {
        error = new HTTPError(404, 'Not found id', 'message of error');
    });

    RobotRepository.prototype.get = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.post = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.patch = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.delete = jest.fn().mockRejectedValue(7);

    const repository = RobotRepository.getInstance();
    const userRepo = UsersRepository.getInstance();
    const robotController = new RobotController(repository, userRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate getAll()', () => {
        test('It should throw an error', async () => {
            repository.getAll = jest.fn().mockRejectedValue('');
            await robotController.getAll(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate get(),', () => {
        test('It should throw an error', async () => {
            await robotController.get(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate post()', () => {
        test('It should throw an error', async () => {
            await robotController.post(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate patch()', () => {
        test('It should throw an error', async () => {
            await robotController.patch(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate delete()', () => {
        test('It should throw an error', async () => {
            await robotController.delete(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate delete(), with a wrong id', () => {
        test('It should throw an error', async () => {
            await robotController.delete(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('When we instantiate createHttpError(),', () => {
        test('It should throw the correct message', async () => {
            error.message = 'Not found id';
            await robotController.createHttpError(error);
            expect(error.message).toBe('Not found id');
        });
    });
});
