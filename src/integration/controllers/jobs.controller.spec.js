const request = require('supertest');

const app = require(__base + 'app');
const jobsDelegate = require(__base + 'integration/delegates/jobs.delegate');

const rightJob = require(__base + 'example/job-example-f8.json');

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

describe('Right job insert', async () => {
  let jobRes;

  test('POST /jobs should return 201 ad the id has to be defined if the new job is created', async () => {
    jobRes = await request(app).post('/jobs').send(rightJob);
    expect(jobRes.status).toBe(201);
    expect(jobRes.body.id).toBeDefined();
  });

  afterAll(async () => {
    await jobsDelegate.deleteJob(jobRes.id);
  });
});