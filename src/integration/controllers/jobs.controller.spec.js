const request = require('supertest');

const app = require(__base + 'app');

test('POST /jobs should return 400 if mandatory fields are not present', async () => {
  let response = await request(app).post('/jobs');
  expect(response.status).toBe(400);
});

test('POST /jobs should return 400 if reward is not present', async () => {
  let wrongJob = {
    data: {
      name: "New job",
      items_csv: "some/path"
    }
  };
  let response = await request(app).post('/jobs').send(wrongJob);
  expect(response.status).toBe(400);
});

test('POST /jobs should return 201 ad the id have to be defined if the new job is created', async () => {
  let job = {
    data: {
      name: "New job",
      reward: 0.12,
      items_csv: "some/path"
    }
  };
  let response = await request(app).post('/jobs').send(job);
  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
});
