import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import CourseEditPage from "main/pages/Courses/CourseEditPage";
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
jest.mock('main/utils/courseUtilities', () => {
    return {
        __esModule: true,
        courseUtilities: {
            update: (_course) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    course: {
                        id: 3,
                        title: "CMPSC 156 - ADV APP PROGRAM",
                        courseNumber: "07427",
                        Department: "Computer Science"
                    }
                }
            }
        }
    }
});


describe("CourseEditPage tests", () => {

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

});


