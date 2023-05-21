const request = require('supertest')
const baseUrl = 'http://localhost:3000/api'

describe('POST /register', () => {
    const user = {
        data: { 
          fullname: 'Test User 1',
          email: 'testuser1@gmail.com',
          password: 'password',
          rePassword: 'password'
        },
    }

    afterEach(async () => {
        await request(baseUrl).delete(`/register?email=${user.data.email}`);
    })

    it('register a new user', async () => {
        const response = await request(baseUrl).post("/register").send(user);
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("Success");
        expect(response.body.message).toBe("Registration successful.");
    }) 

    it('register with existing email', async () => {
        await request(baseUrl).post("/register").send(user);
        const response = await request(baseUrl).post("/register").send(user);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Failed");
        expect(response.body.message).toBe("Email doesn't exist.");
    })
    
    it('register with empty form', async () => {
        const response = await request(baseUrl).post("/register").send({
            data: { 
              fullname: '',
              email: '',
              password: '',
              rePassword: ''
            },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Failed");
        expect(response.body.message).toBe("Please fill in all fields.");
    })

    it('register with different passwords', async () => {
        user.data.rePassword = 'password123'
        const response = await request(baseUrl).post("/register").send(user);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("Failed");
        expect(response.body.message).toBe("Password doesn't match.");
    })
})