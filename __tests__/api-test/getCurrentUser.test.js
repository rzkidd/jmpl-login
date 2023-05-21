const request = require('supertest')
const baseUrl = 'http://localhost:3000/api'

describe('GET /getCurrentUser', () => {
    const user = {
        data: { 
          fullname: 'Test User 1',
          email: 'testuser1@gmail.com',
          password: 'password',
          rePassword: 'password'
        },
    }

    beforeAll(async () => {
        await request(baseUrl).post("/register").send(user);
    })

    afterAll(async () => {
        await request(baseUrl).delete(`/register?email=${user.data.email}`);
    })

    it('get current user', async () => {
        const response = await request(baseUrl).get(`/getCurrentUser?email=${user.data.email}`)
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(user.data.email);
        expect(response.body.fullname).toBe(user.data.fullname);
        
    })
})