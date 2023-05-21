import { fireEvent, getByLabelText, getByRole, getByTestId, render, screen, waitFor } from "@testing-library/react";
import App from "../src/pages/register";
import "@testing-library/jest-dom"

describe('Register', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('register new user (+)', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            status: "Success",
            message: "Registration successful.",
        }))

        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        const pushMock = jest.fn()
        
        useRouter.mockImplementation(async () => ({
            route: '/',
            pathname: '',
            query: '',
            asPath: '',
            push: pushMock,
        }));

        const {findByText} = render(<App/>)
        fireEvent.change(screen.getByLabelText('Fullname'), {target: {value: 'Test User'}});
        fireEvent.change(screen.getByLabelText('Email address'), {target: {value: 'testuser@gmail.com'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText('Retype Password'), {target: {value: 'password123'}});
        fireEvent.submit(screen.getByRole('form'))


        const message = await findByText('Registration successful.')
        expect(message).toBeInTheDocument();
        expect(setTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
        
    })
    
    it('register with existing email (-)', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            status: "Failed",
            message: "Email doesn't exist.",
          }))
        const {findByText} = render(<App/>)
        fireEvent.change(screen.getByLabelText('Fullname'), {target: {value: 'Test User'}});
        fireEvent.change(screen.getByLabelText('Email address'), {target: {value: 'testuser@gmail.com'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText('Retype Password'), {target: {value: 'password123'}});
        fireEvent.submit(screen.getByRole('form'))


        const message = await findByText("Email doesn't exist.")
        expect(message).toBeInTheDocument();
    })
    
    it('register with different passwords (-)', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            status: "Failed",
            message: "Password doesn't match.",
        }))
        const {findByText} = render(<App/>)
        fireEvent.change(screen.getByLabelText('Fullname'), {target: {value: 'Test User'}});
        fireEvent.change(screen.getByLabelText('Email address'), {target: {value: 'testuser@gmail.com'}});
        fireEvent.change(screen.getByLabelText('Password'), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText('Retype Password'), {target: {value: 'password456'}});
        fireEvent.submit(screen.getByRole('form'))


        const message = await findByText("Password doesn't match.")
        expect(message).toBeInTheDocument();
        
    })
})

