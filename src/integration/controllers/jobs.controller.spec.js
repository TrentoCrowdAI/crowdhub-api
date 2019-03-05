const request = require('supertest');

const app = require(__base + 'app');

test('POST /jobs should return 400 if mandatory fields are not present', async () => {
  let response = await request(app).post('/jobs');
  expect(response.status).toBe(400);
});
