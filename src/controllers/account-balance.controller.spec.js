const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /account-balance should return 200', async () => {
    let response = await request(app).get('/account-balance');
    expect(response.status).toBe(200);
    expect(response.body.f8).toBeDefined();
    expect(response.body.tolokaNormal).toBeDefined();
    expect(response.body.tolokaSandbox).toBeDefined();
});