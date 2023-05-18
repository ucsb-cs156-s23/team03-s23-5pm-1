import { render, screen, waitFor } from "@testing-library/react";
import CourseIndexPage from "main/pages/Courses/CourseIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

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


describe("CourseIndexPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

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

});


