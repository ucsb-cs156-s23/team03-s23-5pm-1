import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import CarCreatePage from "main/pages/Cars/CarCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
    
});

describe("CarCreatePage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    
    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const car = {
                id: 17,
                make: "Toyota",
                model: "Camry",
                year: "2022"
            }; 
        
            axiosMock.onPost("/api/cars/post").reply( 202, car );

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CarCreatePage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
    
            await waitFor(() => {
                expect(getByTestId("CarForm-make")).toBeInTheDocument();
            });
    
        const make = getByTestId("CarForm-make");
        const model = getByTestId("CarForm-model");
        const year = getByTestId("CarForm-year");
        const submitButton = getByTestId("CarForm-submit");

    
            fireEvent.change(make, { target: { value: 'Toyota' } });
            fireEvent.change(model, { target: { value: 'Camry' } });
            fireEvent.change(year, { target: { value: '2022' } });
    
            expect(submitButton).toBeInTheDocument();
    
            fireEvent.click(submitButton);
    
            await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    
            expect(axiosMock.history.post[0].params).toEqual(
                {
                "make": "Toyota",
                "model": "Camry",
                "year": "2022"
            });
    
            expect(mockToast).toBeCalledWith("New car Created - id: 17 make: Toyota");
            expect(mockNavigate).toBeCalledWith({ "to": "/cars" });
        });

        });

        



       




