import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import CarForm from "main/components/Cars/CarForm";
import { carFixtures } from "fixtures/carFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("CarForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Make", "Model", "Year"];
  const testId = "CarForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CarForm />
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
            <CarForm />
        </Router>
    );

    expect(await screen.findByTestId("CarForm-submit")).toBeInTheDocument();
    const submitButton = screen.getByTestId("CarForm-submit");

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Make is required./)).toBeInTheDocument();
    expect(screen.getByText(/Model is required./)).toBeInTheDocument();
});

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CarForm initialContents={carFixtures.oneCar} />
        </Router>
      </QueryClientProvider>
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-make`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CarForm />
        </Router>
      </QueryClientProvider>
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});

