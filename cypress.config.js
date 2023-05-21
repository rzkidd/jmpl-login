import { defineConfig } from 'cypress'
import { plugins } from "cypress-social-logins"
const { GoogleSocialLogin } = plugins

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    setupNodeEvents(on, config) {
      on("task", {
        GoogleSocialLogin: GoogleSocialLogin,
      })
    },
    video: false,
    screenshotOnRunFailure: false
  },
  component: {
    supportFile: false
  }
})