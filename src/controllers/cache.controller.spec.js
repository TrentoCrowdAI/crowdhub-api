jest.mock(__base + 'authentication/authentication');
const authentication = require(__base + 'authentication/authentication');
authentication.mockImplementation((req, res, next) => {
  req.user = {
    id: 'testId',
    data: {
      name: 'Mario'
    }
  };
  next();
});
const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /cache/aaa should return 400', async () => {
  let response = await request(app).get('/cache/aaa');
  expect(response.status).toBe(400);
});

test('POST /cache/0 should return 404', async () => {
  let response = await request(app).post('/cache/0');
  expect(response.status).toBe(404);
});

test('GET /cache should return 200', async () => {
  let response = await request(app).get('/cache');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});