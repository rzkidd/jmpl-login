import { render, screen } from '@testing-library/react';
import App from '../src/pages/index';
import MyApp from '../src/pages/_app';
import '@testing-library/jest-dom';

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual('next-auth/react');
    const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { email: "rezasaputra@gmail.com" }
    };
    return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
        return {data: mockSession, status: 'authenticated'}  // return type is [] in v3 but changed to {} in v4
    }),
    };
});

describe('Index Authenticated', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it("show user name when authenticated", async () => {
        fetch.mockResponseOnce(JSON.stringify({email: 'rezasaputra@gmail.com', fullname: 'Reza Saputra'}))
        const {findByText} = render(<App />);
        const name = await findByText('Reza Saputra')

        expect(name).toBeInTheDocument();
    });
    
    it("show Sign Out when authenticated", async () => {
        
        fetch.mockResponseOnce(JSON.stringify({email: 'rezasaputra@gmail.com', fullname: 'Reza Saputra'}))
        const {findByText} = render(<App />);
        const signOut = await findByText('(sign out)')

        expect(signOut).toBeInTheDocument();
    });
});