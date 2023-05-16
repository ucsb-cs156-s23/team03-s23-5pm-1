package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.Car;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarRepository extends CrudRepository<Car, Long> {
  Optional<Car> findByModel(String model);
}