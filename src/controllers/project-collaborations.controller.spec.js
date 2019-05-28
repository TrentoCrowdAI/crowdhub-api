require(__base + 'delegates/user-access.delegate.mocked');

const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /project-collaborations/aaa should return 400', async () => {
    let response = await request(app).get('/project-collaborations/aaa');
    expect(response.status).toBe(400);
});

test('POST /project-collaborations/0 should return 404', async () => {
    let response = await request(app).post('/project-collaborations/0');
    expect(response.status).toBe(404);
});

test('Right project insert, get, delete', async () => {
    let collab = {
        userId: "testUser",
        projectId: 1
    };

    //POST /project-collaborations should return 201 ad the id has to be defined if the new job is created
    let response = await request(app).post('/project-collaborations').send(collab);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    let collabRes = response.body;

    //GET /project-collaborations/id should return 200
    response = await request(app).get('/project-collaborations/' + collabRes.id);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    //DELETE /project-collaborations/id should return 200
    response = await request(app).delete('/project-collaborations/' + collabRes.id);
    expect(response.status).toBe(200);
});

test('GET /project-collaborations should return 200', async () => {
    let response = await request(app).get('/project-collaborations?projectId=1');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
});