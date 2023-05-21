import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CourseEditPage from "main/pages/Courses/CourseEditPage";

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

describe("CourseEditPage tests", () => {
    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/course", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Course");
            expect(queryByTestId("CourseForm-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/course", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: 'CS 156',
                number: 1234,
                instructor: "Phil Conrad"
            });
            axiosMock.onPut('/api/course').reply(200, {
                id: "17",
                title: 'CS 130b',
                number: "2345",
                instructor: "Daniel Lohkstanov"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("CourseForm-title");

            const idField = getByTestId("CourseForm-id");
            const titleField = getByTestId("CourseForm-title");
            const numberField = getByTestId("CourseForm-number");
            const instructorField = getByTestId("CourseForm-instructor");
            const submitButton = getByTestId("CourseForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("CS 156");
            expect(numberField).toHaveValue("1234");
            expect(instructorField).toHaveValue("Phil Conrad");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("CourseForm-title");

            const idField = getByTestId("CourseForm-id");
            const titleField = getByTestId("CourseForm-title");
            const numberField = getByTestId("CourseForm-number");
            const instructorField = getByTestId("CourseForm-instructor");
            const submitButton = getByTestId("CourseForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("CS 156");
            expect(numberField).toHaveValue("1234");
            expect(instructorField).toHaveValue("Phil Conrad");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'CS 130b' } })
            fireEvent.change(numberField, { target: { value: '2345' } })
            fireEvent.change(instructorField, { target: { value: "Daniel Lohkstanov" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Course Updated - id: 17 title: CS 130b");
            expect(mockNavigate).toBeCalledWith({ "to": "/course/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: 'CS 130b',
                number: "2345",
                instructor: "Daniel Lohkstanov"
            })); // posted object

        });

       
    });

    /*
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 
    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
//
        expect(screen.getByTestId("CourseForm-id")).toBeInTheDocument();
        expect(screen.getByDisplayValue('CMPSC 156 - ADV APP PROGRAM')).toBeInTheDocument();
        expect(screen.getByDisplayValue('07427')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
    });

    test("redirects to /courses on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "course": {
                id: 3,
                title: "PORT 105  - SURVEY OF PORT LIT",
                courseNumber: "51342",
                Department: "Spanish and Portuguese"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const courseNumberInput = screen.getByLabelText("Course Number");
        expect(courseNumberInput).toBeInTheDocument();

        const DepartmentInput = screen.getByLabelText("Department");
        expect(DepartmentInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'PORT 105  - SURVEY OF PORT LIT' } })
            fireEvent.change(courseNumberInput, { target: { value: '51342' } })
            fireEvent.change(DepartmentInput, { target: { value: 'Spanish and Portuguese' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedCourse: {"course":{"id":3,"title":"PORT 105  - SURVEY OF PORT LIT","courseNumber":"51342","Department":"Spanish and Portuguese"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });
    */

});


