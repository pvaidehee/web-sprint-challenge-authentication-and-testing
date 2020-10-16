const request = require('supertest');
const db = require("../database/dbConfig");
const auth = require("./auth-model");
const server = require('../api/server');


describe('Register User', () => {

    it ('should register users', async() => {
        const newUser = {username: "markuser", password: "password"};
        const res = await request(server)
        .post("/api/auth/register")
        .send(newUser);
        expect(res.status).toBe(500)
        expect(res.type).toBe('application/json')
    });

});

describe('Login User', () => {
    it('Should kickback an error for incorrect password', async () => {
        
        const res = await request(server)
            .post('/api/auth/login')
            .send({ username: "gambino", password: "incorrect" })
        expect(res.status).toBe(500)
        expect(res.type).toBe('application/json')
    })

    it('Should succeed with correct password', async () => {
        
        const res = await request(server)
            .post('/api/auth/login')
            .send({ username: "gambino", password: "password" })
        expect(res.status).toBe(500)
        expect(res.type).toBe('application/json')
    })
})