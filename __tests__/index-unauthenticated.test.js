import { render, screen } from '@testing-library/react';
import App from '../src/pages/index';
import '@testing-library/jest-dom';

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual('next-auth/react');
    const mockSession = null;
    return {
      __esModule: true,
      ...originalModule,
      useSession: jest.fn(() => {
        return {data: mockSession, status: 'unauthenticated'}  // return type is [] in v3 but changed to {} in v4
      }),
    };
});

describe('Index Unauthenticated', () => {
    
    it("show Sign In when unauthenticated", () => {
        
        render(<App />);
        const signIn = screen.getByRole("button", {
            name: 'Sign In',
        });

        expect(signIn).toBeInTheDocument();
    });
    
    it("show Sign Up when unauthenticated", () => {
        
        render(<App />);
        const signUp = screen.getByRole("button", {
            name: 'Sign Up',
        });

        expect(signUp).toBeInTheDocument();
    });
});