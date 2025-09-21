import request from 'supertest';
import { createTestApp } from './test-server';
import { TestDataSource, setupTestDatabase, teardownTestDatabase, clearTestDatabase } from './test-db-setup';
import User from '../src/models/userModel';
import { beforeAll, afterAll, beforeEach, describe, expect, it } from '@jest/globals';

const app = createTestApp();

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            const userRepository = TestDataSource.getRepository(User);
            const testUser = userRepository.create({
                name: 'Test User',
                email: 'test@example.com',
                password: '$2b$10$3Nsdwgw7CwhslzNmMEr1FOkon0yur0Zl8LCGs0Yvabj4cqvgdXLf2',
                phone: '0112224448'
            });
            await userRepository.save(testUser);
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'qwerty'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('id');
        });

        it('should return 401 for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });

        it('should return 404 for invalid users', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test2@example.com',
                    password: 'password'
                });

            expect(response.status).toBe(404);
        });
    });
});