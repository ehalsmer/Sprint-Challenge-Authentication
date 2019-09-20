const request = require('supertest');

const Users = require('./users-model');
const db = require('../database/dbConfig');
const server = require('../api/server');

describe('Users model', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })
    it('should set env to testing', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });

    // Register endpoint with Users.add()
    describe('add()', () => {
        it('should add a new user to the db', async () => {
            const newUser = await Users.add({username: 'testUser', password: '1234'});
            expect(newUser.username).toBe('testUser');
        });
    });
    describe('/api/auth/register', () => {
        it('should return status 201', () => {
            return request(server).post('/api/auth/register').send({username: 'testUser', password: '1234'})
            .then(res => {
                expect(res.status).toBe(201)
            })
        });
    });

    // Login endpoint
    describe('/api/auth/login', () => {
        it('should return status 200', async () => {
            await request(server).post('/api/auth/register').send({username: 'testUser', password: '1234'})
            return request(server).post('/api/auth/login').send({username: 'testUser', password: '1234'})
            .then(res => {
                expect(res.status).toBe(200)
            })
        });
        it('should return a token upon successful login', async () => {
            await request(server).post('/api/auth/register').send({username: 'testUser', password: '1234'})
            return request(server).post('/api/auth/login').send({username: 'testUser', password: '1234'})
            .then(res => {
                expect(res.body.token).toBeUndefined
            })
        });
    });
})