import React, { useCallback, useState } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
  MDBProgress,
  MDBProgressBar
}
from 'mdb-react-ui-kit';
import { useReCaptcha } from 'next-recaptcha-v3';
import { passwordStrength } from 'check-password-strength';
import { Toast, ToastContainer } from 'react-bootstrap';
import {useRouter} from 'next/router';

function App() {
  // const { executeRecaptcha } = useReCaptcha();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('Too weak')
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false);
  const [responseStatus, setResponseStatus] = useState('')
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  console.log(baseUrl)

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // if (passwordStrengthLabel == 'Too weak') {
      //   alert('Your password is too weak. Still proceed?')
      // }

      // Generate ReCaptcha token
      // const token = await executeRecaptcha("register");
      // console.log(token)

      fetch(baseUrl + '/api/register', {
        method: "POST",
        headers: new Headers({
          "Content-Type": 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          data: { 
            fullname: fullname,
            email: email,
            password: password,
            rePassword: rePassword
          },
          // token: token,
        }),
      })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response)
        setResponseStatus(response.status)
        setMessage(response.message)
        setShow(true);
        setTimeout(() => {
          if (responseStatus == 'Success') {
            console.log(responseStatus)
            router.push('/login')
          }
        }, 3000)
        }
      )
    },
    // [executeRecaptcha]
  )

  const handleChange = (e) => {
    switch (e.target.id) {
      case "fullname":
        setFullname(e.target.value)
        break;
      case "email":
        setEmail(e.target.value)
        break;
      case "password":
        setPassword(e.target.value)
        setTimeout(() => {
          setPasswordStrengthLabel(passwordStrength(password).value)
        }, 1000)
        break;

      case "rePassword":
        setRePassword(e.target.value)
        break;

      default:
        break;
    }
  }

  return (
    <>
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

          <form onSubmit={handleSubmit} role='form' data-testid="form-register">
            <MDBInput wrapperClass='mb-4' label='Fullname' id='fullname' type='text' size="lg" value={fullname} onChange={(e) => handleChange(e)} maxLength={50} required/>
            <MDBInput wrapperClass='mb-4' label='Email address' id='email' type='email' size="lg" value={email} onChange={(e) => handleChange(e)} maxLength={50} required/>

            <MDBInput wrapperClass={!password && 'mb-4'} label='Password' id='password' type='password' size="lg" value={password} onChange={(e) => handleChange(e)} required/>
            {password && (
            <>
              <MDBProgress className='my-2'>
                <MDBProgressBar className={
                  (passwordStrengthLabel == 'Too weak') ? 'w-25 bg-danger' : 
                  (passwordStrengthLabel == 'Weak') ? 'w-50 bg-warning' : 
                  (passwordStrengthLabel == 'Medium') ? 'w-75 bg-warning' : 'w-100 bg-success'
                } valuemin={0} valuemax={100} />
              </MDBProgress>
              <div id='textExample1' 
                className={
                  (passwordStrengthLabel == 'Too weak') ? 'form-text mb-2 text-danger' : 
                  (passwordStrengthLabel == 'Weak' || passwordStrengthLabel == 'Medium') ? 'form-text mb-2 text-warning' : 'form-text mb-2 text-success'
                }
              >
                {password && passwordStrengthLabel}
              </div>
            </>
            )}
            <MDBInput wrapperClass='mb-4' label='Retype Password' id='rePassword' type='password' size="lg" value={rePassword} onChange={(e) => handleChange(e)} required/>
            <MDBBtn className="mb-4 w-100" size='lg'>Sign up</MDBBtn>
          </form>

            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">OR</p>
            </div>

            <MDBBtn className="mb-4 w-100" size="lg" style={{backgroundColor: '#3b5998'}}>
              <MDBIcon fab icon="google" className="mx-2"/>
              Continue with Google
            </MDBBtn>

          </MDBCol>

        </MDBRow>

      </MDBContainer>
    </>
  );
}

export default App;