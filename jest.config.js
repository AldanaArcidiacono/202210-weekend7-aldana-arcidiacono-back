/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist', 'src/entities'],
    coveragePathIgnorePatterns: ['src/entities'],
    resolver: 'jest-ts-webcompat-resolver',
};
