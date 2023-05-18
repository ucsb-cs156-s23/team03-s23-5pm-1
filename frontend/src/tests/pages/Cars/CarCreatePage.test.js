import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import CarCreatePage from "main/pages/Cars/CarCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/carUtils', () => {
    return {
        __esModule: true,
        carUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("CarCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /cars on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
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
                    <CarCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const makeInput = screen.getByLabelText("Make");
        expect(makeInput).toBeInTheDocument();

        const modelInput = screen.getByLabelText("Model");
        expect(modelInput).toBeInTheDocument();

        const yearInput = screen.getByLabelText("Year");
        expect(yearInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(makeInput, { target: { value: 'Toyota' } })
            fireEvent.change(modelInput, { target: { value: 'Camry' } })
            fireEvent.change(yearInput, { target: { value: '2022' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/cars"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdCar: {"car":{"id":3,"make":"Toyota","model":"Camry","year":"2022"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


