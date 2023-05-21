const baseUrl = Cypress.env('API_URL')

// cypress/tests/api/api-users.spec.ts

context("POST /register", () => {
    const user = {
        data: { 
          fullname: 'Test User 1',
          email: 'testuser1@gmail.com',
          password: 'password',
          rePassword: 'password'
        },
    }
    
    after(() => {
        cy.request("DELETE", `/api/register?email=${user.data.email}`);
    })

    it("register a new user", () => {
      cy.request({
        method: "POST",
        url: "/api/register",
        body: user,
        failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.status).to.eq("Success");
        expect(response.body.message).to.eq("Registration successful.")
      })
    })

    it('register with existing email',  () => {
        cy.request({
            method: "POST",
            url: "/api/register",
            body: user,
            failOnStatusCode: false
        })
        cy.request({
            method: "POST",
            url: "/api/register",
            body: user,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("Failed");
            expect(response.body.message).to.eq("Email doesn't exist.");
        })
    })
    
    it('register with empty form',  () => {
        cy.request({
            method: "POST", 
            url: "/api/register", 
            body : {
                data: { 
                    fullname: '',
                    email: '',
                    password: '',
                    rePassword: ''
                }
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("Failed");
            expect(response.body.message).to.eq("Please fill in all fields.");
        })
    })

    it('register with different passwords',  () => {
        user.data.rePassword = 'password123';
        cy.request({
            method: "POST",
            url: "/api/register",
            body: user,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("Failed");
            expect(response.body.message).to.eq("Password doesn't match.");
        })
    })
})
