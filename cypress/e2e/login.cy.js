/// <reference types="cypress" />

describe("Page - Login", () => {
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

    beforeEach(() => {
      cy.log(`Login page`)
      cy.visit("login")
    })

    after( () => {
      cy.visit("/api/auth/signout")
      cy.get("form").submit()
      cy.request("DELETE", `/api/register?email=${user.data.email}`)
    })

    it("Login with Google", () => {
      const username = Cypress.env("GOOGLE_USER")
      const password = Cypress.env("GOOGLE_PW")
      const loginUrl = `${Cypress.env("SITE_NAME")}/login`
      const cookieName = Cypress.env("COOKIE_NAME")
      const socialLoginOptions = {
        username,
        password,
        loginUrl,
        headless: true,
        logs: false,
        isPopup: true,
        loginSelector: `button.google-login`,
        postLoginSelector: ".toast-header.bg-success",
      }
  
      return cy
        .task("GoogleSocialLogin", socialLoginOptions)
        .then(({ cookies }) => {
          cy.clearCookies()
  
          const cookie = cookies
            .filter((cookie) => cookie.name === cookieName)
            .pop()
          if (cookie) {
            cy.setCookie(cookie.name, cookie.value, {
              domain: cookie.domain,
              expiry: cookie.expires,
              httpOnly: cookie.httpOnly,
              path: cookie.path,
              secure: cookie.secure,
            })
  
            // Cypress.Cookies.defaults({
            //   preserve: cookieName,
            // })
  
            // remove the two lines below if you need to stay logged in
            // for your remaining tests
            // cy.visit("/api/auth/signout")
            // cy.get("form").submit()
          }
        })
    })

    it('Login with correct credentials', () => {
      const email = Cypress.env("CRED_EMAIL")
      const password = Cypress.env("CRED_PW")
      cy.get("input.form-control#email").type(email)
      cy.get("input[type=password]").type(password)

      cy.contains('Sign in').click()

      cy.get('.toast-body').should('contain', 'Login success')
    })
    
    it('Login with unregistered email', () => {
      const email = "email@gmail.com"
      const password = Cypress.env("CRED_PW")
      cy.get("input.form-control#email").type(email)
      cy.get("input[type=password]").type(password)

      cy.contains('Sign in').click()

      cy.get('.toast-body').should('contain', 'Invalid credentials')
    })
    
    it('Login with incorrect password', () => {
      const email = Cypress.env("CRED_EMAIL")
      const password = "password123"
      cy.get("input.form-control#email").type(email)
      cy.get("input[type=password]").type(password)

      cy.contains('Sign in').click()

      cy.get('.toast-body').should('contain', 'Invalid credentials')
    })
    
    it('Cannot open /login when signed in', () => {
      const email = Cypress.env("CRED_EMAIL")
      const password = Cypress.env("CRED_PW")
      cy.get("input.form-control#email").type(email)
      cy.get("input[type=password]").type(password)

      cy.contains('Sign in').click()

      cy.get('.toast-body').should('contain', 'Login success')

      cy.visit("/")
      cy.visit("/login")
      cy.url().should('not.contain', 'login')
    })
})