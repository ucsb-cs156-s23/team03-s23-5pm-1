import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import CourseTable, { showCell } from "main/components/Courses/CourseTable";
import { courseFixtures } from "fixtures/courseFixtures";
import mockConsole from "jest-mock-console";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("CourseTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id","Course Title","Course Number", "Instructor"];
  const expectedFields = ["id", "title", "number", "instructor"];
  const testId = "CourseTable";

  test("No login renders without crashing for empty table", () => {
    const currentUser = null;
    render(
      <QueryClientProvider client={queryClient} currentUser = {currentUser}>
        <MemoryRouter>
          <CourseTable courses={[]} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("User login renders without crashing for empty table", () => {
    const currentUser = currentUserFixtures.userOnly;
    render(
      <QueryClientProvider client={queryClient} currentUser = {currentUser}>
        <MemoryRouter>
          <CourseTable courses={[]} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Admin login renders without crashing for empty table", () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient} currentUser = {currentUser}>
        <MemoryRouter>
          <CourseTable courses={[]} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Admin Has the expected column headers, content and buttons", () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={courseFixtures.threeCourses} currentUser = {currentUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("ECE 153B - SNSR/PERPH INT DSGN");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("ENGL 24 - LOCAL AND GLOBAL");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveClass("btn-primary");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content and no buttons when showButtons=false", () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={courseFixtures.threeCourses} currentUser = {currentUser} showButtons={false}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("ECE 153B - SNSR/PERPH INT DSGN");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("ENGL 24 - LOCAL AND GLOBAL");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page for admin", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={courseFixtures.threeCourses} currentUser={currentUser}/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("ECE 153B - SNSR/PERPH INT DSGN");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/courses/edit/1'));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `editCallback: {"id":1,"title":"ECE 153B - SNSR/PERPH INT DSGN","number":"59261","instructor":"Electrical and Computer Engineering"})`;
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });

  test("Details button navigates to the details page", async () => {
    //setupAdminUser();
    // arrange
    const currentUser = currentUserFixtures.adminUser;
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={courseFixtures.threeCourses} currentUser = {currentUser} showButtons = {true} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("ECE 153B - SNSR/PERPH INT DSGN");

    const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();

    // act - click the details button
    fireEvent.click(detailsButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/courses/details/1'));

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `detailsCallback: {"id":1,"title":"ECE 153B - SNSR/PERPH INT DSGN","number":"59261","instructor":"Electrical and Computer Engineering"})`;
    expect(message).toMatch(expectedMessage);
    restoreConsole();
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;
    // arrange
    const restoreConsole = mockConsole();

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseTable courses={courseFixtures.threeCourses} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("ECE 153B - SNSR/PERPH INT DSGN");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

     // act - click the delete button
    fireEvent.click(deleteButton);

     // assert - check that the console.log was called with the expected message
     await(waitFor(() => expect(console.log).toHaveBeenCalled()));
     const message = console.log.mock.calls[0][0];
     const expectedMessage = `deleteCallback: {"id":1,"title":"ECE 153B - SNSR/PERPH INT DSGN","number":"59261","instructor":"Electrical and Computer Engineering"})`;
     expect(message).toMatch(expectedMessage);
     restoreConsole();
  });
});
