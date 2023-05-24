import {fireEvent, render, waitFor } from "@testing-library/react";
import CourseDetailsPage from "main/pages/Courses/CourseDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x),
    };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
        }),
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});
/*
jest.mock('main/utils/courseUtilities', () => {
    return {
        __esModule: true,
        courseUtilities: {
            getById: (_id) => {
                return {
                    course: {
                        id: 3,
                        title: "ENGL 24 - LOCAL AND GLOBAL",
                        courseNumber: "18051",
                        Department: "Isla Vista"
                    }
                }
            }
        }
    }
});
*/
describe("CourseDetailsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "CourseTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };
    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders one course without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course", { params: { id: 1 } }).reply(200, {
            id: 1,
            title: "Name1",
            number: 123,
            instructor: "Phil",
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(
                getByTestId(`${testId}-cell-row-0-col-id`)
            ).toHaveTextContent("1");
        });
        expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent(
            "Name1"
        );
        expect(
            getByTestId(`${testId}-cell-row-0-col-number`)
        ).toHaveTextContent("123");
        expect(
            getByTestId(`${testId}-cell-row-0-col-instructor`)
        ).toHaveTextContent("Phil");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders one course without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course", { params: { id: 1 } }).reply(200, {
            id: 1,
            title: "Name1",
            number: 123,
            instructor: "Phil",
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(
                getByTestId(`${testId}-cell-row-0-col-id`)
            ).toHaveTextContent("1");
        });
        expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent(
            "Name1"
        );
        expect(
            getByTestId(`${testId}-cell-row-0-col-number`)
        ).toHaveTextContent("123");
        expect(
            getByTestId(`${testId}-cell-row-0-col-instructor`)
        ).toHaveTextContent("Phil");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/course").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
        });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch(
            "Error communicating with backend via GET on /api/course"
        );
        restoreConsole();

        /*expect(
            queryByTestId(`${testId}-cell-row-0-col-id`)
        ).not.toBeInTheDocument(); */
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
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    */
/*
    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("ENGL 24 - LOCAL AND GLOBAL")).toBeInTheDocument();
        //expect(screen.getByText("Isla Vista")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });
*/
});



