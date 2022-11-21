import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../repository/robots';
import { RobotController } from './robots';
import { HTTPError } from '../interface/error';

jest.mock('../repository/robots');

const mockData = [
    {
        name: 'Pepe',
        img: 'url.img',
        speed: 8,
        strength: 10,
        creationDate: '10/20/25',
    },
    {
        name: 'Ernesto',
        img: 'url.img',
        speed: 4,
        strength: 7,
        creationDate: '10/20/29',
    },
];

describe('Given the robots controller,', () => {
    RobotRepository.prototype.getAll = jest.fn().mockResolvedValue(mockData);
    RobotRepository.prototype.get = jest.fn().mockResolvedValue(mockData[0]);
    RobotRepository.prototype.post = jest.fn().mockResolvedValue('newRobot');
    RobotRepository.prototype.patch = jest.fn().mockResolvedValue(mockData[0]);
    RobotRepository.prototype.delete = jest
        .fn()
        .mockResolvedValue({ id: '45sd' });

    const repository = new RobotRepository();
    const robotController = new RobotController(repository);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate getAll()', () => {
        test('It should return an array of all Robots', async () => {
            await robotController.getAll(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData });
        });
    });

    describe('When we instantiate get(), with an id', () => {
        test('It should return the Robot of that id', async () => {
            req.params = { id: '45sd' };
            await robotController.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: mockData[0] });
        });
    });

    describe('When we instantiate post()', () => {
        test('It should return the new Robot', async () => {
            await robotController.post(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: 'newRobot' });
        });
    });

    describe('When we instantiate patch(), with an id and an updated Robot', () => {
        test('It should return the updated Robot', async () => {
            await robotController.patch(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ robots: 'newRobot' });
        });
    });

    describe('When we instantiate delete(), with an id', () => {
        test('It should return an object with the deleted id', async () => {
            await robotController.delete(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ id: '45sd' });
        });
    });
});

describe('Given the robots controller, but everything goes wrong', () => {
    let error: HTTPError;
    beforeEach(() => {
        error = new HTTPError(404, 'Not found id', 'message of error');
    });

    RobotRepository.prototype.getAll = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.get = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.post = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.patch = jest.fn().mockRejectedValue(['Robot']);
    RobotRepository.prototype.delete = jest.fn().mockRejectedValue(7);

    const repository = new RobotRepository();
    const robotController = new RobotController(repository);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    describe('When we instantiate getAll()', () => {
        test('It should throw an error', async () => {
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
