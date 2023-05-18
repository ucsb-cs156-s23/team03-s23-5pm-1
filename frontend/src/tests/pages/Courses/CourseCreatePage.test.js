import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import CourseCreatePage from "main/pages/Courses/CourseCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/courseUtilities', () => {
    return {
        __esModule: true,
        courseUtilities: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("CourseCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /courses on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "course": {
                id: 3,
                title: "CMPSC 156 - ADV APP PROGRAM",
                courseNumber: "07427",
                Department: "Computer Science"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const courseNumberInput = screen.getByLabelText("Course Number");
        expect(courseNumberInput).toBeInTheDocument();

        const DepartmentInput = screen.getByLabelText("Department");
        expect(DepartmentInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'CMPSC 156 - ADV APP PROGRAM' } })
            fireEvent.change(courseNumberInput, { target: { value: '07427' } })
            fireEvent.change(DepartmentInput, { target: { value: 'Computer Science' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/courses"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdCourse: {"course":{"id":3,"title":"CMPSC 156 - ADV APP PROGRAM","courseNumber":"07427","Department":"Computer Science"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


