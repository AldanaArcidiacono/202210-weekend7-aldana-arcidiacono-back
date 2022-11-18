import mongoose from 'mongoose';
import { dbConnect } from './db.conect.js';

describe('Given dbConnect', () => {
    test('When we instantiate it should make a connection', async () => {
        const result = await dbConnect();
        expect(typeof result).toBe(typeof mongoose);
        mongoose.disconnect();
    });
});
