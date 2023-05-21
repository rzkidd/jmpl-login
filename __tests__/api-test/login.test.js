const request = require('supertest')
const baseUrl = 'http://localhost:3000/api'

describe('POST /login', () => {
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

    it('login with right credentials', async () => {
        const login = {
            data: {
                email: 'testuser1@gmail.com',
                password: 'password',
            }
        }
        const response = await request(baseUrl).post("/login").send(login);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("Success");
        expect(response.body.message).toBe("Login success.");
        expect(response.body.data.name).toBe(user.data.fullname);
        expect(response.body.data.email).toBe(user.data.email);
    }) 

    it('login with empty form', async () => {
        const login = {
            data: {
                email: '',
                password: '',
            }
        }
        const response = await request(baseUrl).post("/login").send(login);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Failed");
        expect(response.body.message).toBe("Please fill in all fields.");
    }) 

    it('login with non-existed email', async () => {
        const login = {
            data: {
                email: 'gaada@gmail.com',
                password: 'password',
            }
        }
        const response = await request(baseUrl).post("/login").send(login);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Failed");
        expect(response.body.message).toBe("Email or password is incorrect.");
    }) 
    
    it('login with incorrect password', async () => {
        const login = {
            data: {
                email: 'testuser1@gmail.com',
                password: 'password123',
            }
        }
        const response = await request(baseUrl).post("/login").send(login);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Failed");
        expect(response.body.message).toBe("Email or password is incorrect.");
    }) 
})