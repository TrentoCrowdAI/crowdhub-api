const request = require('supertest');
// const fetch = require('node-fetch');

const app = require('./app');

const BASE_URL = 'http://localhost:3000';

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

// test('GET / should return 200 (using fetch)', () => {
//   return fetch(BASE_URL).then(response => {
//     expect(response.status).toBe(200);
//   });
// });

// // you can also use async/await
// test('GET / should return 200 (using fetch & async/await)', async () => {
//   let response = await fetch(BASE_URL);
//   expect(response.status).toBe(200);
// });

// same as above but using supertest
test('GET / should return 200 (using supertest)', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});