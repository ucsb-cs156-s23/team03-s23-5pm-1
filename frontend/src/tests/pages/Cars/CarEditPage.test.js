import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import CarEditPage from "main/pages/Cars/CarEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/carUtils', () => {
    return {
        __esModule: true,
        carUtils: {
            update: (_car) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    car: {
                        id: 3,
                        make: "Toyota",
                        model: "Camry",
                        year: "2022"
                    }
                }
            }
        }
    }
});


describe("CarEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("CarForm-id")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Toyota')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Camry')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022')).toBeInTheDocument();
    });

    test("redirects to /cars on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "car": {
                id: 3,
                make: "Toyota",
                model: "Camry",
                year: "2022"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const makeInput = screen.getByLabelText("Make");
        expect(makeInput).toBeInTheDocument();


        const modelInput = screen.getByLabelText("Model");
        expect(modelInput).toBeInTheDocument();

        const yearInput = screen.getByLabelText("Year");
        expect(yearInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(makeInput, { target: { value: 'Toyota' } })
            fireEvent.change(modelInput, { target: { value: 'Camry' } })
            fireEvent.change(yearInput, { target: { value: '2022' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/cars"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedCar: {"car":{"id":3,"make":"Toyota","model":"Camry","year":"2022"}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


