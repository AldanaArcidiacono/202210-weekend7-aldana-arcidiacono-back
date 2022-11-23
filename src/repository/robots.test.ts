import { MongooseError } from 'mongoose';
import { dbConnect } from '../db.conect';
import { Robot } from '../entities/robots';
import { RobotRepository } from './robots';

const mockData = [{ name: 'Pepe' }, { name: 'Ernesto' }];

describe('Given the robots repository,', () => {
    const repository = RobotRepository.getInstance();
    let testIds: Array<string>;

    beforeAll(async () => {
        await dbConnect();
        await Robot.deleteMany();
        await Robot.insertMany(mockData);
        const data = await Robot.find();
        testIds = [data[0].id, data[1].id];
    });

    describe('When we instantiate getAll()', () => {
        test('It should return an array of all Robots', async () => {
            const result = await repository.getAll();
            expect(result[0].name).toEqual(mockData[0].name);
        });
    });

    describe('When we instantiate get(), with an id', () => {
        test('It should return the Robot of that id', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.name).toEqual(mockData[0].name);
        });

        test('If the id is not valid, it should throw an error', async () => {
            expect(async () => {
                await repository.get(testIds[3]);
            }).rejects.toThrow();
        });
    });

    describe('When we instantiate find(), with an id', () => {
        test('It should return the search', async () => {
            const result = await repository.find(mockData[0]);
            expect(result.name).toEqual(mockData[0].name);
        });
    });

    describe('When we instantiate post()', () => {
        test('It should return the new Robot', async () => {
            const newRobot = { name: 'Elena' };
            const result = await repository.post(newRobot);
            expect(result.name).toEqual(newRobot.name);
        });
    });

    describe('When we instantiate patch(), with an id and an updated Robot', () => {
        test('It should return the updated Robot', async () => {
            const updatedRobot = { name: 'Jose' };
            const result = await repository.patch(testIds[0], updatedRobot);
            expect(result.name).toEqual(updatedRobot.name);
        });

        test('If the id is not valid, it should throw an error', async () => {
            expect(async () => {
                await repository.patch(testIds[3], {});
            }).rejects.toThrowError(MongooseError);
        });
    });

    describe('When we instantiate delete(), with an id', () => {
        test('It should return an object with the deleted id', async () => {
            const result = await repository.delete(testIds[0]);
            expect(result).toEqual({ id: testIds[0] });
        });

        test('If the id is wrong, it should throw an error', async () => {
            expect(async () => {
                await repository.delete(23);
            }).rejects.toThrow();
        });

        test('If the id is wrong, it should throw an error', async () => {
            expect(async () => {
                await repository.delete('6378fbf8fbdf746f860da478');
            }).rejects.toThrow();
        });

        test('Then if id is bad formate delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(testIds[0]);
            }).rejects.toThrow();
        });
    });

    afterAll(async () => {
        await repository.disconnect();
    });
});
