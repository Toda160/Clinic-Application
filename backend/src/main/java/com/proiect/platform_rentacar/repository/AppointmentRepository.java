package com.proiect.platform_rentacar.repository;

import com.proiect.platform_rentacar.entity.Appointment;
import com.proiect.platform_rentacar.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long doctorId);
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.dateTime >= :startOfDay AND a.dateTime < :endOfDay")
    List<Appointment> findByDoctorIdAndDay(
            @Param("doctorId") Long doctorId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
    boolean existsByDoctorIdAndDateTime(Long doctorId, LocalDateTime dateTime);
    @Query("SELECT a FROM Appointment a WHERE a.patient.username = :username")
    List<Appointment> findByPatientUsername(String username);

}
