const Users = require('./users-model');
const db = require('../database/dbConfig');

describe('Users model', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })
    it('should set env to testing', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });
    describe('add()', () => {
        it('should add a new user to the db', async () => {
            const newUser = await Users.add({username: 'testUser', password: '1234'});
            expect(newUser.username).toBe('testUser');
        });
    });
})