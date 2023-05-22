import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import CourseCreatePage from "main/pages/Courses/CourseCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
//mport mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
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

describe("CourseCreatePage tests", () => {
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
                    <CourseCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const course = {
            id: 17,
            title: "CS 156",
            number: 1234,
            instructor: "Phil Conrad"
        };

        axiosMock.onPost("/api/course/post").reply( 202, course );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("CourseForm-title")).toBeInTheDocument();
        });

        const title = getByTestId("CourseForm-title");
        const number = getByTestId("CourseForm-number");
        const instructor = getByTestId("CourseForm-instructor");
        const submitButton = getByTestId("CourseForm-submit");

        fireEvent.change(title, { target: { value: 'CS 156' } });
        fireEvent.change(number, { target: { value: 1234 } });
        fireEvent.change(instructor, { target: { value: 'Phil Conrad' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                'title': "CS 156",
                'number': 1234,
                'instructor': "Phil Conrad"
        });

        expect(mockToast).toBeCalledWith("New Course Created - id: 17 title: CS 156");
        expect(mockNavigate).toBeCalledWith({ "to": "/course/list" });
    });







});

    /*
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
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 
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
*/

