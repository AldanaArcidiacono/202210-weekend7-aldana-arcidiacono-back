import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.conect';
import { User } from '../entities/users';
import { TokenPayload } from '../services/auth';

const setCollection = async () => {
    const mockData = [
        {
            name: 'Pepe',
            email: 'pepe@gmail.com',
            pasword: '12345',
            role: 'Admin',
        },
        {
            name: 'Ernesto',
            email: 'ernest@gmail.com',
            pasword: '6789',
            role: 'user',
        },
    ];
    await User.deleteMany();
    await User.insertMany(mockData);
    const data = await User.find();
    const testIds: Array<string> = [data[0].id, data[1].id];
    return testIds;
};

describe('Given an app with "/users/" route', () => {
    describe('When we connect with MongoDB', () => {
        let ids: Array<string>;

        beforeEach(async () => {
            await dbConnect();
            ids = await setCollection();
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the post() to url /register should send an status 201', async () => {
            const response = await request(app).post('/users/register').send({
                name: 'Amelia',
                email: 'ameliawho@gmail.com',
                password: '123456',
                role: 'user',
            });
            expect(response.status).toBe(201);
        });

        test('Then the post() to url /register with bad information should send an status 503', async () => {
            const response = await request(app).post('/users/register').send({
                name: '',
                email: 'ameliawho@gmail.com',
                password: '123456',
                role: 'user',
            });
            expect(response.status).toBe(503);
        });

        test('Then with the post on the url /login with a wrong password should send an status 503', async () => {
            const response = await request(app).post('/users/login').send({
                name: 'Pepe',
                password: 'adsjk',
            });
            expect(response.status).toBe(503);
        });
    });
});
