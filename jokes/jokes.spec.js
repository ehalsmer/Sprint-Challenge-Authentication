const request = require('supertest');

const Users = require('../auth/users-model');
const db = require('../database/dbConfig');
const server = require('../api/server');

describe('/api/jokes', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })
    it('returns status 400 without authorization header', () => {
        return request(server).get('/api/jokes')
        .then(res => {
            expect(res.status).toBe(400)
        })
    });
    it('returns status 200 when passed authorization header with valid token', async () => {
        await request(server).post('/api/auth/register').send({username: 'testUser', password: '1234'})
        await request(server).post('/api/auth/login').send({username: 'testUser', password: '1234'})
        .then(response => {
            // console.log(response.text)
            const {token} = JSON.parse(response.text)
            console.log(token)
            return token;
        })
        .then(async token => {
            console.log(token)
            const serverResponse = await request(server).get('/api/jokes').set('authorization', token)
            return serverResponse
        })
        .then(response => {
            expect(response.status).toBe(200)
        })
    })
});