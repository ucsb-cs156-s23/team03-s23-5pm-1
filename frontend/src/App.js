import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";


import CourseIndexPage from "main/pages/Courses/CourseIndexPage";
import CourseCreatePage from "main/pages/Courses/CourseCreatePage";
import CourseEditPage from "main/pages/Courses/CourseEditPage";

import CarCreatePage from "main/pages/Cars/CarCreatePage";
import CarEditPage from "main/pages/Cars/CarEditPage";
import CarIndexPage from "main/pages/Cars/CarIndexPage";
import CarDetailsPage from "main/pages/Cars/CarDetailsPage";

import RestaurantsIndexPage from "main/pages/Restaurants/RestaurantsIndexPage";
import RestaurantsCreatePage from "main/pages/Restaurants/RestaurantsCreatePage";
import RestaurantsEditPage from "main/pages/Restaurants/RestaurantsEditPage";
import RestaurantsDetailsPage from "main/pages/Restaurants/RestaurantsDetailsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />

              <Route exact path="/course/list" element={<CourseIndexPage />} />

              <Route exact path="/restaurants/list" element={<RestaurantsIndexPage />} />

              <Route exact path="/cars/list" element={<CarIndexPage />} />


            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />

              <Route exact path="/course/edit/:id" element={<CourseEditPage />} />
              <Route exact path="/course/create" element={<CourseCreatePage />} />

              <Route exact path="/restaurants/edit/:id" element={<RestaurantsEditPage />} />
              <Route exact path="/restaurants/details/:id" element={<RestaurantsDetailsPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantsCreatePage />} />

              <Route exact path="/cars/edit/:id" element={<CarEditPage />} />
              <Route exact path="/cars/create" element={<CarCreatePage />} />

            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;