require(__base + 'delegates/user-access.delegate.mocked');

const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /runs/aaa should return 400', async () => {
  let response = await request(app).get('/runs/aaa');
  expect(response.status).toBe(400);
});

test('POST /runs/0 should return 404', async () => {
  let response = await request(app).post('/runs/0');
  expect(response.status).toBe(404);
});

test('GET /runs should return 200', async () => {
  let response = await request(app).get('/runs');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});