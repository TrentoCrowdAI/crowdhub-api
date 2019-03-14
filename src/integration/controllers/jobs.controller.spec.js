const request = require('supertest');

const app = require(__base + 'app');

const rightJob = require(__base + 'example/job-example-f8.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

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

test('POST /jobs/aaa/publish should return 400', async () => {
  let response = await request(app).post('/jobs/aaa/publish');
  expect(response.status).toBe(400);
});

test('POST /jobs/0/publish should return 404', async () => {
  let response = await request(app).post('/jobs/0/publish');
  expect(response.status).toBe(404);
});

test('Right job insert, get, update, delete', async () => {
  let jobRes;

  //POST /jobs should return 201 ad the id has to be defined if the new job is created
  let response = await request(app).post('/jobs').send(rightJob);
  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  jobRes = response.body;

  //GET /jobs/id should return 200
  response = await request(app).get('/jobs/' + jobRes.id);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  //PUT /jobs/id should return 200
  response = await request(app).put('/jobs/' + jobRes.id).send(rightJob);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();


  //DELETE /jobs/id should return 200
  response = await request(app).delete('/jobs/' + jobRes.id);
  expect(response.status).toBe(200);
});

test('GET /jobs should return 200', async () => {
  let response = await request(app).get('/jobs');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});