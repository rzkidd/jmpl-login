context('GET /getCurrentUser', () => {
    const user = {
        data: { 
          fullname: 'Test User 1',
          email: 'testuser1@gmail.com',
          password: 'password',
          rePassword: 'password'
        },
    }

    before( () => {
        cy.request("POST", `/api/register`, user)
    })

    after( () => {
        cy.request("DELETE", `/api/register?email=${user.data.email}`)
    })

    it('get current user',  () => {
        cy.request(`/api/getCurrentUser?email=${user.data.email}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.email).to.eq(user.data.email);
            expect(response.body.fullname).to.eq(user.data.fullname);
        })
        
    })
})