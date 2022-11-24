/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist', 'src/entities'],
    coveragePathIgnorePatterns: [
        'src/entities',
        'node_modules/supertest/lib/test',
    ],
    resolver: 'jest-ts-webcompat-resolver',
};
