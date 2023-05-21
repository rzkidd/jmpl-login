import { plugins } from "cypress-social-logins"
const { GoogleSocialLogin } = plugins

export default (on, config) => {
  on("task", {
    GoogleSocialLogin: GoogleSocialLogin,
  })
}