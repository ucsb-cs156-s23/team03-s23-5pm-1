import { render, waitFor, fireEvent } from "@testing-library/react";
import CourseForm from "main/components/Courses/CourseForm";
import {courseFixtures} from "fixtures/courseFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("CourseForm tests", () => {
    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await findByText(/Title/);
        await findByText(/Create/);
    });

    test("renders correctly when passing in a Course", async () => {
        //console.log(courseFixtures.oneCourse);
        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <CourseForm initialCourse={courseFixtures.oneCourse} />
            </Router>
        );
        await findByTestId(/CourseForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        console.log(getByTestId(/CourseForm-title/));
        expect(getByTestId(/CourseForm-id/)).toHaveValue("1");
    });


});
/*
describe("CourseForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "Number", "Instructor"];
    const testId = "CourseForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm initialContents={courseFixtures.oneCourse} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
    */
