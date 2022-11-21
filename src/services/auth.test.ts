import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';
import {
    createToken,
    passwdEncrypt,
    passwdValidate,
    verifyToken,
} from './auth';

const mockPayload = { userName: 'Pepe' };

describe('Given createToken()...', () => {
    test('Then...', () => {
        const signSpy = jest.spyOn(jwt, 'sign');
        const result = createToken(mockPayload);
        expect(typeof result).toBe('string');
        expect(signSpy).toHaveBeenCalled();
    });
});

describe('Given verifyToken()...', () => {
    const token = createToken(mockPayload);
    console.log(token);

    describe('When token is valid...', () => {
        test('Then...', () => {
            const result = verifyToken(token);
            expect(result.userName).toBe(mockPayload.userName);
        });
    });

    describe('When token is not valid...', () => {
        test('Then if the token is wrong it should throw an error', () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlBlcGUiLCJpYXQiOjE2Njg3NzMwNTR9.P1oitfdk-xVzRUFj9gumqs3bPo1OCzgEhh-1YXQ_WN7';
            expect(() => {
                verifyToken(token);
            }).toThrow();
        });

        test('Then if the token is empty it should throw an error', () => {
            const token = '';
            expect(() => {
                verifyToken(token);
            }).toThrow();
        });
    });
});

describe('Given passwdEncrypt()...', () => {
    test('Then it should encrypt the users password', async () => {
        const signSpy = await jest.spyOn(bc, 'hash');
        const result = await passwdEncrypt('Pepe');
        expect(typeof result).toBe('string');
        expect(signSpy).toHaveBeenCalled();
    });
});

describe('Given passwdValidate()...', () => {
    test('Then it should encrypt the users password', async () => {
        const signSpy = await jest.spyOn(bc, 'compare');
        const encrypt = await passwdEncrypt('Pepe');
        const result = await passwdValidate('Pepe', encrypt);
        expect(result).toBe(true);
        expect(signSpy).toHaveBeenCalled();
    });
});
