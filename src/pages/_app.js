import './css/styles.css'
import "bootstrap/dist/css/bootstrap.min.css"
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import Script from 'next/script'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { SessionProvider } from 'next-auth/react'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps: {session, ...pageProps} }) {
    return (
        <ReCaptchaProvider
            reCaptchaKey={process.env.RECAPTCHA_SITE_KEY}
        >
            <SessionProvider session={session}>
                <Script src="bootstrap\dist\js\bootstrap.bundle.min.js"/>
                <Component {...pageProps} />
            </SessionProvider>
        </ReCaptchaProvider>
    )
}

