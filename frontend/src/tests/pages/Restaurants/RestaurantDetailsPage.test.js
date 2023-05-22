import {render, screen, waitFor} from "@testing-library/react";
import RestaurantsDetailsPage from "main/pages/Restaurants/RestaurantsDetailsPage";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";

// I stole this from https://github.com/ucsb-cs156-s23/team03-s23-5pm-4/pull/17
// for mocking /api/currentUser and /api/systemInfo
import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 3
    }),
  };
});

describe("RestaurantsDetailsPage tests", () => {

  let queryClient;
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    queryClient = new QueryClient();

    axiosMock.reset();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders headers only when backend doesn't return a restaurant", async () => {
    axiosMock.onGet("/api/restaurants", {params: {id: 3}}).reply(200, {
        id: 3,
        name: "Freebirds",
        description: "Burritos"
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantsDetailsPage/>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Restaurant Details");

    const expectedHeaders = ["id", "name", "description"];
    expectedHeaders.forEach((header) => {
      expect(screen.getByTestId(`RestaurantTable-header-${header}`)).toBeInTheDocument();
    });

  });

  describe("when backend returns a restaurant", () => {
    beforeEach(() => {
      axiosMock.onGet("/api/restaurants", {params: {id: 3}}).reply(200, {
        id: 3,
        name: "Freebirds",
        description: "Burritos"
      });
    });

    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantsDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );
    });

    test("loads the correct fields, and has no buttons", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RestaurantsDetailsPage/>
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Freebirds")).toBeInTheDocument();
      });

      expect(screen.getByText("Freebirds")).toBeInTheDocument();
      expect(screen.getByText("Burritos")).toBeInTheDocument();

      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
      expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

  });
});