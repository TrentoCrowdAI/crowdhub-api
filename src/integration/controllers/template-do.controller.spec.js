const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /template-do/aaa should return 400', async () => {
  let response = await request(app).get('/template-do/aaa');
  expect(response.status).toBe(400);
});

test('POST /template-do/0 should return 404', async () => {
  let response = await request(app).post('/template-do/0');
  expect(response.status).toBe(404);
});

test('Right template-do insert, get, update, delete', async () => {
  let templ = {
    name: "test",
    instructions: "Some instructions",
    blocks: []
  };

  //POST /template-do should return 201 ad the id has to be defined if the new template-do is created
  let response = await request(app).post('/template-do').send(templ);
  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  let templRes = response.body;

  //GET /template-do/id should return 200
  response = await request(app).get('/template-do/' + templRes.id);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  //PUT /template-do/id should return 200
  response = await request(app).put('/template-do/' + templRes.id).send(templ);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();


  //DELETE /template-do/id should return 200
  response = await request(app).delete('/template-do/' + templRes.id);
  expect(response.status).toBe(200);
});

test('GET /template-do should return 200', async () => {
  let response = await request(app).get('/template-do');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});