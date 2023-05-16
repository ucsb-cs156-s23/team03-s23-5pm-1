package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Car;
import edu.ucsb.cs156.example.repositories.CarRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;


import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = CarController.class)
@Import(TestConfig.class)
public class CarControllerTests extends ControllerTestCase {

        @MockBean
        CarRepository CarRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/cars/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/cars/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/cars/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/cars?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/cars/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/cars/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/cars/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                Car car = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                when(CarRepository.findById(eq(7L))).thenReturn(Optional.of(car));

                // act
                MvcResult response = mockMvc.perform(get("/api/cars?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(CarRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(car);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(CarRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/cars?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(CarRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Car with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_cars() throws Exception {

                // arrange

                Car car1 = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                Car car2 = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                ArrayList<Car> expectedCars = new ArrayList<>();
                expectedCars.addAll(Arrays.asList(car1, car2));

                when(CarRepository.findAll()).thenReturn(expectedCars);

                // act
                MvcResult response = mockMvc.perform(get("/api/cars/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(CarRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedCars);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_car() throws Exception {
                // arrange

                Car car1 = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                when(CarRepository.save(eq(car1))).thenReturn(car1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/cars/post?make=Ford&model=Mustang&year=1969")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(CarRepository, times(1)).save(car1);
                String expectedJson = mapper.writeValueAsString(car1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_car() throws Exception {
                // arrange

                Car car1 = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                when(CarRepository.findById(eq(15L))).thenReturn(Optional.of(car1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/cars?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(CarRepository, times(1)).findById(15L);
                verify(CarRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Car with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_car_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(CarRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/cars?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(CarRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Car with id 15 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_car() throws Exception {
                // arrange

                Car carOrig = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                Car carEdited = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1970)
                                .build();

                String requestBody = mapper.writeValueAsString(carEdited);

                when(CarRepository.findById(eq(67L))).thenReturn(Optional.of(carOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/cars?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(CarRepository, times(1)).findById(67L);
                verify(CarRepository, times(1)).save(carEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_car_that_does_not_exist() throws Exception {
                // arrange



                Car CarEdited = Car.builder()
                                .make("Ford")
                                .model("Mustang")
                                .year(1969)
                                .build();

                String requestBody = mapper.writeValueAsString(CarEdited);

                when(CarRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/cars?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(CarRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Car with id 67 not found", json.get("message"));

        }
}