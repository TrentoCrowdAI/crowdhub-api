require(__base + 'delegates/user-access.delegate.mocked');

const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('Users controller', async () => {
    test('GET /users with email filter should return 200 and test /users/id', async () => {
        let response = await request(app).get('/users?email=davide.zanella10@gmail.com');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        for(let user of response.body){
            let res = await request(app).get('/users/' + user.id);
            expect(res.status).toBe(200);
        }
    });
});
