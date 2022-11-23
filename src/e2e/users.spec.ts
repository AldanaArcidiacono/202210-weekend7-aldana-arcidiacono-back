import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.conect';
import { User } from '../entities/users';
import { createToken, TokenPayload } from '../services/auth';

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

describe('Given an app with "/robots/" route', () => {
    let token: string;
    let ids: Array<string>;

    beforeEach(async () => {
        await dbConnect();
        ids = await setCollection();
        const payload: TokenPayload = {
            id: ids[0],
            name: 'Pepe',
            role: 'Admin',
        };
        token = createToken(payload);
    });

    afterEach(async () => {
        await mongoose.disconnect();
    });

    describe('When we have connection to mongoDB', () => {
        test('Then the post() to url /register should send an status 201', async () => {
            const response = await request(app).post('/users/register').send({
                name: 'Amelia',
                email: 'ameliawho@gmail.com',
                password: '123456',
                role: 'user',
            });
            expect(response.status).toBe(201);
        });

        test('Then the post() to url /register without a name should send an status 503', async () => {
            const response = await request(app).post('/users/register').send({
                name: '',
                email: 'ameliawho@gmail.com',
                password: '123456',
                role: 'user',
            });
            expect(response.status).toBe(503);
        });

        test('Then the post() to url /login with a wrong password should send an status 503', async () => {
            const response = await request(app).post('/users/login').send({
                name: 'Pepe',
                password: 'adsjk',
            });
            expect(response.status).toBe(503);
        });
    });
});
