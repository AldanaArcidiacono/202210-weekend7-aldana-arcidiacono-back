import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.conect';
import { Robot } from '../entities/robots';
import { User } from '../entities/users';
import { createToken, TokenPayload } from '../services/auth';

const setCollection = async () => {
    const mockData = [
        { name: 'Sergio', email: 'sergio@gmail.com', role: 'user' },
        { name: 'Ango', email: 'ango@gmail.com', role: 'user' },
    ];
    await User.deleteMany();
    await User.insertMany(mockData);
    await Robot.deleteMany();
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
        test('Then the get() to url / should send an status 200', async () => {
            await request(app).get('/robots/').expect(200);
        });

        test('Then the get() to url / with a bad formed id should send an status 404', async () => {
            await request(app)
                .get('/robots/6378fbf8fbdf743f860da140')
                .expect(404);
        });

        test('Then the post() to url without authorization should send an status 403', async () => {
            const response = await request(app)
                .post('/robots/create')
                .send({ name: 'Evaristo' });
            expect(response.status).toBe(403);
        });

        test('Then the post() to url with authorization should send an status 201', async () => {
            const response = await request(app)
                .post('/robots/create')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Elena' });
            expect(response.status).toBe(201);
        });

        test('then the patch to urls /robots/update/ with an id without authorization should send status 403', async () => {
            const response = await request(app)
                .patch('/robots/update/6378d483b738f3e5d87e8685')
                .send({ name: 'Amelia' });
            expect(response.status).toBe(403);
        });
    });
});

describe('Given an app with "http://localhost:7700" route', () => {
    beforeEach(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await mongoose.disconnect();
    });

    describe('When we have connection to mongoDB', () => {
        test('Then the get() to url / should send an status 200', async () => {
            await request(app).get('/').expect(200);
        });
    });
});
