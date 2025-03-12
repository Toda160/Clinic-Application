package com.proiect.platform_rentacar.repository;

import com.proiect.platform_rentacar.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUsername(String username);
    Optional<Doctor> findByFirstnameAndLastname(String firstname, String lastname);
    List<Doctor> findAll();


}
