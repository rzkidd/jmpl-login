describe('Page - Index', () => {
    const user = {
        data: { 
          fullname: 'Test User 1',
          email: 'testuser1@gmail.com',
          password: 'password',
          rePassword: 'password'
        },
    }   

    before(() => {
        cy.request("POST", `/api/register`, user)
    })

    after( () => {
        cy.visit("/api/auth/signout")
        cy.get("form").submit()
        cy.request("DELETE", `/api/register?email=${user.data.email}`)
    })

    it("show Sign In when unauthenticated", () => {
        
        cy.visit('/')
        cy.contains('Sign In').should('exist')
    });
    
    it("show Sign Up when unauthenticated", () => {
        
        cy.visit('/')
        cy.contains('Sign Up').should('exist')
    });

    it("show user name when authenticated", () => {
        cy.visit('/login')
        const email = Cypress.env("CRED_EMAIL")
        const password = Cypress.env("CRED_PW")
        cy.get("input#email").type(email)
        cy.get("input[type=password]").type(password)

        cy.contains('Sign in').click()

        cy.get('.toast-body').should('contain', 'Login success')

        cy.visit("/")
        cy.get('li.nav-item span').should('contain', user.data.fullname)
    });
    
    it("show Sign Out when authenticated", () => {
        cy.visit('/login')
        const email = Cypress.env("CRED_EMAIL")
        const password = Cypress.env("CRED_PW")
        cy.get("input#email").type(email)
        cy.get("input[type=password]").type(password)

        cy.contains('Sign in').click()

        cy.get('.toast-body').should('contain', 'Login success')

        cy.visit("/")
        cy.get('li.nav-item a').should('contain', '(sign out)')
    });
});