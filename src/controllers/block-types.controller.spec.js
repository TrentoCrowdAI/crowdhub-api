require(__base + 'delegates/user-access.delegate.mocked');

const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /block-types/aaa should return 400', async () => {
    let response = await request(app).get('/block-types/aaa');
    expect(response.status).toBe(400);
});

test('GET /block-types should return 200', async () => {
    let response = await request(app).get('/block-types');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    for (let blockType of response.body) {
        let responseBlock = await request(app).get('/block-types/' + blockType.id);
        expect(responseBlock.status).toBe(200);
        expect(responseBlock.body).toBeInstanceOf(Object);
    }
});