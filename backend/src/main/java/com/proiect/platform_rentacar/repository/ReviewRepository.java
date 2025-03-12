package com.proiect.platform_rentacar.repository;

import com.proiect.platform_rentacar.entity.Doctor;
import com.proiect.platform_rentacar.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctor(Doctor doctor);
}
