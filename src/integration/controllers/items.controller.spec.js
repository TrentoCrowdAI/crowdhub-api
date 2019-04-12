const request = require('supertest');

const app = require(__base + 'app');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

test('GET /items/aaa should return 400', async () => {
    let response = await request(app).get('/items/aaa');
    expect(response.status).toBe(400);
});

test('POST /items/0 should return 404', async () => {
    let response = await request(app).post('/items/0');
    expect(response.status).toBe(404);
});

test('Right items insert, get, update, delete', async () => {
    let items = {
        id_project: 0,
        items: [{
            name: "a name",
            abstract: "some text"
        }, {
            name: "b name",
            abstract: "some text"
        }]
    };

    //POST /items should return 201 ad the id has to be defined if the new items are created
    let response = await request(app).post('/items').send(items);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Array);

    let newItems = response.body;
    for (let el of newItems) {
        expect(el.id).toBeDefined();

        //GET /items/id should return 200
        response = await request(app).get('/items/' + el.id);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();

        //PUT /items/id should return 200
        response = await request(app).put('/items/' + el.id).send(el);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();


        //DELETE /items/id should return 200
        response = await request(app).delete('/items/' + el.id);
        expect(response.status).toBe(200);
    }
});

test('Right CSV items insert, get, update, delete', async () => {
    let items = {
        csv_url: "https://raw.githubusercontent.com/TrentoCrowdAI/servant-api/develop/src/example/image-classification.csv",
        id_project: 0
    };

    //POST /items should return 201 ad the id has to be defined if the new items are created
    let response = await request(app).post('/items').send(items);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Array);

    let newItems = response.body;
    for (let el of newItems) {
        expect(el.id).toBeDefined();

        //GET /items/id should return 200
        response = await request(app).get('/items/' + el.id);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();

        //PUT /items/id should return 200
        response = await request(app).put('/items/' + el.id).send(el);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();


        //DELETE /items/id should return 200
        response = await request(app).delete('/items/' + el.id);
        expect(response.status).toBe(200);
    }
});

test('GET /items should return 200', async () => {
    let response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
});