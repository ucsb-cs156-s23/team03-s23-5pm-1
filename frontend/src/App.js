import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import AvilaBeachPage from "main/pages/Towns/AvilaBeachPage";
import LosAlamosPage from "main/pages/Towns/LosAlamosPage";
import ArroyoGrandePage from "main/pages/Towns/ArroyoGrandePage";

import "bootstrap/dist/css/bootstrap.css";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import BookCreatePage from "main/pages/Books/BookCreatePage";
import BookEditPage from "main/pages/Books/BookEditPage";
import BookIndexPage from "main/pages/Books/BookIndexPage";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";

import CourseCreatePage from "main/pages/Courses/CourseCreatePage";
import CourseEditPage from "main/pages/Courses/CourseEditPage";
import CourseIndexPage from "main/pages/Courses/CourseIndexPage";
import CourseDetailsPage from "main/pages/Courses/CourseDetailsPage";

import CarCreatePage from "main/pages/Cars/CarCreatePage";
import CarEditPage from "main/pages/Cars/CarEditPage";
import CarIndexPage from "main/pages/Cars/CarIndexPage";
import CarDetailsPage from "main/pages/Cars/CarDetailsPage";

function App() {

  const reload = () => window.location.reload();

  return (
    <BrowserRouter basename="/team01-s23-5pm-1">
      <Routes>
        <Route path="/storybook-static" onEnter={reload}/>
        <Route exact path="/" element={<HomePage />} />

        <Route exact path="/towns/AvilaBeach" element={<AvilaBeachPage />} />
        <Route exact path="/towns/LosAlamos" element={<LosAlamosPage />} />
        <Route exact path="/towns/ArroyoGrande" element={<ArroyoGrandePage />} />
        
        <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
        <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
        <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
        <Route exact path="/restaurants/" element={<RestaurantIndexPage />} />

        <Route exact path="/books/create" element={<BookCreatePage />} />
        <Route exact path="/books/edit/:id" element={<BookEditPage />} />
        <Route exact path="/books/details/:id" element={<BookDetailsPage />} />
        <Route exact path="/books/" element={<BookIndexPage />} />

        <Route exact path="/courses/create" element={<CourseCreatePage />} />
        <Route exact path="/courses/edit/:id" element={<CourseEditPage />} />
        <Route exact path="/courses/details/:id" element={<CourseDetailsPage />} />
        <Route exact path="/courses/" element={<CourseIndexPage />} />

        <Route exact path="/cars/create" element={<CarCreatePage />} />
        <Route exact path="/cars/edit/:id" element={<CarEditPage />} />
        <Route exact path="/cars/details/:id" element={<CarDetailsPage />} />
        <Route exact path="/cars/" element={<CarIndexPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
