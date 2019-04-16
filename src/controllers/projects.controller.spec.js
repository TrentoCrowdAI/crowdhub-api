const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /projects/aaa should return 400', async () => {
  let response = await request(app).get('/projects/aaa');
  expect(response.status).toBe(400);
});

test('POST /projects/0 should return 404', async () => {
  let response = await request(app).post('/projects/0');
  expect(response.status).toBe(404);
});

test('Right project insert, get, update, delete', async () => {
  let proj = {
    name: "test",
    description: "desc"
  };

  //POST /projects should return 201 ad the id has to be defined if the new job is created
  let response = await request(app).post('/projects').send(proj);
  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  let projRes = response.body;

  //GET /projects/id should return 200
  response = await request(app).get('/projects/' + projRes.id);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  //PUT /projects/id should return 200
  response = await request(app).put('/projects/' + projRes.id).send(proj);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();


  //DELETE /projects/id should return 200
  response = await request(app).delete('/projects/' + projRes.id);
  expect(response.status).toBe(200);
});

test('GET /projects should return 200', async () => {
  let response = await request(app).get('/projects');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});