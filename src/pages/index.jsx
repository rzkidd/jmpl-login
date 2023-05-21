import React, {useState} from "react";
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBContainer,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Toast, ToastContainer } from 'react-bootstrap';
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function App() {
    const {data: session, status} = useSession()
    const [show, setShow] = useState(false);
    const [user, setUser] = useState()
    const [message, setMessage] = useState('')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL    // console.log(session)

    useEffect(() => {
        if (session?.user.name ){
            setMessage(`Signed in with Google as ${session?.user.name}`)
            setShow(true)
        } else if (session) {
            fetch(baseUrl + '/api/getCurrentUser?email=' + session?.user.email)
            .then(response => response.json())
            .then(response => {
                // console.log(response)
                setUser(response)
            })
        }
    }, [session])

    // console.log(session, status)
    
    return (
        <header style={{ paddingLeft: 0 }} role="heading">
            <ToastContainer position='top-center' className='p-3'>
                <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide >
                <Toast.Header className='bg-success text-white' closeVariant='white'>
                    <strong className="me-auto">My App</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
                </Toast>  
            </ToastContainer>
            <MDBNavbar expand="lg" light bgColor="white">
                <MDBContainer fluid>
                <MDBNavbarToggler
                    aria-controls="navbarExample01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <MDBIcon fas icon="bars" />
                </MDBNavbarToggler>
                <div className="collapse navbar-collapse" id="navbarExample01">
                    <MDBNavbarNav right className="mb-2 mb-lg-0">
                        <MDBNavbarItem active>
                            <MDBNavbarLink aria-current="page" href="#">
                            Home
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        {
                        (session) ? 
                        <MDBNavbarItem className="ms-auto d-flex">
                            <span className="p-2">{session.user.name || user?.fullname}</span>
                            <MDBNavbarLink href="#" onClick={(e) => {e.preventDefault(); signOut()}} >(sign out)</MDBNavbarLink>
                        </MDBNavbarItem>
                        : 
                        <MDBNavbarItem className="ms-auto d-flex">
                            <a href="/login" className="me-3">
                                <MDBBtn className="w-100" size="lg" style={{backgroundColor: '#3b5998'}} > Sign In</MDBBtn>
                            </a>
                            <a href="/register" >
                                <MDBBtn className="w-100 bg-white text-dark " size="lg" style={{borderColor: '#3b5998'}} > Sign Up</MDBBtn>
                            </a>
                        </MDBNavbarItem>
                        }
                    </MDBNavbarNav>
                </div>
                </MDBContainer>
            </MDBNavbar>

            <div
                className="p-5 text-center bg-image"
                style={{
                backgroundImage:
                    "url('https://mdbootstrap.com/img/new/slides/041.webp')",
                height: 400,
                }}
            >
                <div className="mask" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                {/* <div className='d-flex justify-content-center align-items-center h-100'>
                    <div className='text-white'>
                    <h1 className='mb-3'>Heading</h1>
                    <h4 className='mb-3'>Subheading</h4>
                    <a className='btn btn-outline-light btn-lg' href='#!' role='button'>
                        Call to action
                    </a>
                    </div>
                </div> */}
                </div>
            </div>
        </header>
    );
}
