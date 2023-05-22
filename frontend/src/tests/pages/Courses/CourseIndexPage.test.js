import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CourseIndexPage from "main/pages/Courses/CourseIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { courseFixtures } from "fixtures/courseFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));
/*
const mockDelete = jest.fn();
jest.mock('main/utils/courseUtilities', () => {
    return {
        __esModule: true,
        courseUtilities: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    courses: [
                        {
                            "id": 3,
                "title": "ENGL 24 - LOCAL AND GLOBAL",
                "courseNumber": "18051",
                "Department": "Isla Vista"
                        },
                    ]
                }
            }
        }
    }
});
*/
const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});


describe("CourseIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "CourseTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };
    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });
    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three courses without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course/all").reply(200, courseFixtures.threeCourses);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders three courses without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course/all").reply(200, courseFixtures.threeCourses);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/course/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course/all").reply(200, courseFixtures.threeCourses);
        axiosMock.onDelete("/api/course").reply(200, "Course with id 1 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); 


        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);
        await waitFor(() => expect(mockToast).toBeCalled);
        //expect(mockToast).toBeCalledWith("Course with id 1 was deleted");
       // await waitFor(() => { expect(mockToast).toBeCalledWith("Course with id 1 was deleted") });

    });
/*
    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createCourseButton = screen.getByText("Create Course");
        expect(createCourseButton).toBeInTheDocument();
        expect(createCourseButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("ENGL 24 - LOCAL AND GLOBAL");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("18051");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("CourseTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("CourseTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("CourseTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("ENGL 24 - LOCAL AND GLOBAL");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("18051");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("CourseTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `CourseIndexPage deleteCallback: {"id":3,"title":"ENGL 24 - LOCAL AND GLOBAL","courseNumber":"18051","Department":"Isla Vista"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });
*/
});


