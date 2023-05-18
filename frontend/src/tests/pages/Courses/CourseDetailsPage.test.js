import { render, screen } from "@testing-library/react";
import CourseDetailsPage from "main/pages/Courses/CourseDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

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

describe("CourseDetailsPage tests", () => {

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

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("ENGL 24 - LOCAL AND GLOBAL")).toBeInTheDocument();
        expect(screen.getByText("18051")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


