import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import CourseForm from "main/components/Courses/CourseForm";
import { courseFixtures } from "fixtures/courseFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Course tests", () => {
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

    test("Correct Error messages on missing input", async () => {
        render(
            <Router  >
                <CourseForm />
            </Router>
        );
        expect(await screen.findByTestId("CourseForm-submit")).toBeInTheDocument();
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.click(submitButton);

        expect(await screen.findByText(/Title is required./)).toBeInTheDocument();
        expect(screen.getByText(/Number is required./)).toBeInTheDocument();
    });
    test("renders correctly when passing in initialContents", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <Router>
              <CourseForm initialContents={courseFixtures.oneCourse} />
            </Router>
          </QueryClientProvider>
        );
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expect(await screen.findByTestId(`${testId}-title`)).toBeInTheDocument();
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



/* import { render, waitFor, fireEvent } from "@testing-library/react";
import CourseForm from "main/components/Courses/CourseForm";
import { courseFixtures } from "fixtures/courseFixtures";
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

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <CourseForm initialCourse={courseFixtures.oneCourse}  />
            </Router>
        );
        await findByTestId(/CourseForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/CourseForm-id/)).toHaveValue("1");
    });

    //////
    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await findByTestId("CourseForm-title");
        const titleField = getByTestId("CourseForm-title");
        const numberField = getByTestId("CourseForm-number");
        const submitButton = getByTestId("CourseForm-submit");

        fireEvent.change(titleField, { target: { value: 'bad-input' } });
        fireEvent.change(numberField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        // await findByText(/title must be in the format YYYYQ/);
        // expect(getByText(/localDateTime must be in ISO format/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await findByTestId("CourseForm-submit");
        const submitButton = getByTestId("CourseForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Title is required./);
        expect(getByText(/Number is required./)).toBeInTheDocument();
        expect(getByText(/Instructor is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <CourseForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("CourseForm-title");

        const titleField = getByTestId("CourseForm-title");
        const numberField = getByTestId("CourseForm-number");
        const instructorField = getByTestId("CourseForm-instructor");
        const submitButton = getByTestId("CourseForm-submit");

        fireEvent.change(titleField, { target: { value: 'The Habit' } });
        fireEvent.change(numberField, { target: { value: 3} });
        fireEvent.change(instructorField, { target: { value: "Phil Conrad" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());


    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await findByTestId("CourseForm-cancel");
        const cancelButton = getByTestId("CourseForm-cancel");

        fireEvent.click(cancelButton);
        
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });
});


import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import CourseForm from "main/components/Courses/CourseForm";
import {courseFixtures} from "fixtures/courseFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("CourseForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "Number", "Instructor"];
    const testId = "CourseForm";
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
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });
        await findByTestId(/CourseForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        console.log(getByTestId(/CourseForm-id/));
        expect(getByTestId(/CourseForm-id/)).toHaveValue("1");
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
});


    test("renders correctly when passing in initialCourse", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <Router>
              <CourseForm initialContents={courseFixtures.oneCourse} />
            </Router>
          </QueryClientProvider>
        );
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expect(await screen.findByTestId(/CourseForm-id/)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
      });




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
});