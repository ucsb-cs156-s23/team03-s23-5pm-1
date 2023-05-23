import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CarEditPage from "main/pages/Cars/CarEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("CarEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/cars", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();

    test("renders header but table is not present", async () => {

        const restoreConsole = mockConsole();

        const {getByText, queryByTestId, findByText} = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await findByText("Edit Car");
        expect(queryByTestId("CarForm-make")).not.toBeInTheDocument();
        restoreConsole();
    });

});


describe("tests where backend is working normally", () => {

    const axiosMock = new AxiosMockAdapter(axios);


    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/cars", { params: { id: 17 } }).reply(200, {
            id: "17",
            make: 'Toyota',
            model: "Camry",
            year: "2022"
        });

        axiosMock.onPut('/api/cars').reply(200, {
            id:"17",
            make: 'Toyota',
            model: "Camry",
            year: "2022"
        });
    });

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

    test("Is populated with the data provided", async () => {

        const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await findByTestId("CarForm-make");

        const idField = getByTestId("CarForm-id");
        const makeField = getByTestId("CarForm-make");
        const modelField = getByTestId("CarForm-model");
        const yearField = getByTestId("CarForm-year");
        const submitButton = getByTestId("CarForm-submit");

        expect(idField).toHaveValue("17");
        expect(makeField).toHaveValue("Toyota");
        expect(modelField).toHaveValue("Camry");
        expect(yearField).toHaveValue("2022");
    });

    test("Changes when you click Update", async () => {

        const { getByTestId, findByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CarEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await findByTestId("CarForm-make");

            const idField = getByTestId("CarForm-id");
            const makeField = getByTestId("CarForm-make");
            const modelField = getByTestId("CarForm-model");
            const yearField = getByTestId("CarForm-year");
            const submitButton = getByTestId("CarForm-submit");


        
            expect(idField).toHaveValue("17");
            expect(makeField).toHaveValue("Toyota");
            expect(modelField).toHaveValue("Camry");
            expect(yearField).toHaveValue("2022");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(makeField, { target: { value: 'Toyota' } })
            fireEvent.change(modelField, { target: { value: 'Camry' } })
            fireEvent.change(yearField, { target: { value: '2022' } })

            fireEvent.click(submitButton);
      

            await waitFor(() => expect(mockToast).toBeCalled);

            expect(mockToast).toBeCalledWith("Car Updated - id: 17 make: Toyota");
            expect(mockNavigate).toBeCalledWith({ "to": "/cars/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                make: 'Toyota',
                model: "Camry",
                year: "2022"
            })); // posted object

        });


    });

});


