import React, { useCallback, useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
}
from 'mdb-react-ui-kit';
import { useReCaptcha } from 'next-recaptcha-v3';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useSession, signIn } from 'next-auth/react';
import { useRouter} from 'next/router';

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [responseStatus, setResponseStatus] = useState('')
  const [show, setShow] = useState(false);
  const { executeRecaptcha } = useReCaptcha();
  const { data: session, status, update} = useSession()
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL  
  if (session){
    router.push('/')
  }
  
  

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Generate ReCaptcha token
      const token = await executeRecaptcha("login");
      // console.log(token, email, password)

      signIn('credentials', {
        email: email,
        password: password,
        token: token,
        callbackUrl: baseUrl,
        redirect: false
      })
      .then((callback) => {
        console.log(callback)
  
        if (callback?.ok) {
          setResponseStatus('Success')
          setMessage('Login success')
          setShow(true)
          setTimeout(() => {
            router.push('/')
          }, 1500)
        }
        
        if (callback?.error) {
          setResponseStatus('Failed')
          setMessage('Invalid credentials.')
          setShow(true)
        }
      });

      // fetch('http://localhost:3000/api/login', {
      //   method: "POST",
      //   headers: new Headers({
      //     "Content-Type": 'application/json',
      //     Accept: 'application/json',
      //   }),
      //   body: JSON.stringify({
      //     data: { 
      //       email: email,
      //       password: password,
      //     },
      //     token: token,
      //   }),
      // })
      // .then((response) => response.json())
      // .then((response) => {
      //   console.log(response)
      //   setResponseStatus(response.status)
      //   setMessage(response.message)
      //   setShow(true)
      //   setTimeout(() => {
      //     if (responseStatus == 'Success') {
      //       Router.push('/')
      //     }
      //   }, 3000)
        
      // })
    },
    // [executeRecaptcha]
  )

  

  return (
    <MDBContainer fluid className="p-3 my-5">
      <ToastContainer position='top-end' className='p-3'>
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide >
          <Toast.Header className={(responseStatus == 'Success') ? 'bg-success text-white' : 'bg-danger text-white'} closeVariant='white'>
              <strong className="me-auto">My App</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>  
      </ToastContainer>

      <MDBRow>

        <MDBCol col='10' md='8'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
        </MDBCol>

        <MDBCol col='4' md='4' className='mt-5'>

          <form onSubmit={handleSubmit} role='form'>
            <MDBInput wrapperClass='mb-4' label='Email address' id='email' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} required/>


            <div className="d-flex justify-content-between mx-4 mb-4">
              {/* <MDBCheckbox name='flexCheck' value={rememberMe} onChange={e => setRememberMe(e.target.value)} id='flexCheckDefault' label='Remember me' /> */}
              {/* <a href="!#">Forgot password?</a> */}
            </div>

            <MDBBtn className="mb-4 w-100" size='lg'>Sign in</MDBBtn>
          </form>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">OR</p>
          </div>

          {/* <MDBBtn className="mb-4 w-100 google-login" size="lg" style={{backgroundColor: '#3b5998'}} onClick={(e) => {e.preventDefault(); signIn('google', { callbackUrl: 'http://localhost:3000' })}}>
            <MDBIcon fab icon="google" className="mx-2"/>
            Continue with Google
          </MDBBtn> */}

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default App;