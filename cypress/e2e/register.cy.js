describe('Page - Register', () => {
    const user = {
        data: { 
          fullname: 'Test User 1',
          email: 'testuser1@gmail.com',
          password: 'password',
          rePassword: 'password'
        },
    }   

    beforeEach(() => {
        cy.log(`Register page`)
        cy.visit("register")
    })

    it('register new user (+)',  () => {
        cy.get("input#fullname").type(user.data.fullname)
        cy.get("input#email").type(user.data.email)
        cy.get("input#password").type(user.data.password)
        cy.get("input#rePassword").type(user.data.rePassword)
        cy.contains('Sign up').click()

        cy.get('.toast-body').should('contain', 'Registration successful.')
        
        cy.request("DELETE", `/api/register?email=${user.data.email}`)
    })
    
    it('register with existing email (-)', () => {
        cy.request("POST", `/api/register`, user)

        cy.get("input#fullname").type(user.data.fullname)
        cy.get("input#email").type(user.data.email)
        cy.get("input#password").type(user.data.password)
        cy.get("input#rePassword").type(user.data.rePassword)
        cy.contains('Sign up').click()

        cy.get('.toast-body').should('contain', "Email doesn't exist.")

        cy.request("DELETE", `/api/register?email=${user.data.email}`)
    })
    
    it('register with different passwords (-)', () => {
        cy.get("input#fullname").type(user.data.fullname)
        cy.get("input#email").type(user.data.email)
        cy.get("input#password").type(user.data.password)
        cy.get("input#rePassword").type("repassword")
        cy.contains('Sign up').click()

        cy.get('.toast-body').should('contain', "Password doesn't match.")
        
    })
})

