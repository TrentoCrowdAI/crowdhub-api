const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /public-workflows should return 200', async () => {
    let response = await request(app).get('/public-workflows');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    for (let i = 0; i < 5 && i < response.body; i++) {
        expect(response.body[i].id).toBeDefined();
        let resElem = await request(app).get('/public-workflows/' + response.body[i].id);
        expect(response.status).toBe(200);
    }
});