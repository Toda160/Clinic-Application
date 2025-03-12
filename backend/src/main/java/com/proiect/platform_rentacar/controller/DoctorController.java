package com.proiect.platform_rentacar.controller;

import com.proiect.platform_rentacar.entity.Appointment;
import com.proiect.platform_rentacar.entity.Doctor;
import com.proiect.platform_rentacar.entity.Patient;
import com.proiect.platform_rentacar.entity.Role;
import com.proiect.platform_rentacar.repository.AppointmentRepository;
import com.proiect.platform_rentacar.repository.PatientRepository;
import com.proiect.platform_rentacar.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.proiect.platform_rentacar.repository.DoctorRepository;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentRepository appointmentRepository;

    @PostMapping
    public Doctor postDoctor(@RequestBody Doctor doctor) {
        return doctorService.postDoctor(doctor);
    }

    @PostMapping("/add-patient")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        System.out.println("Received request: " + patient);

        // Verifică dacă utilizatorul este autentificat
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        // Verifică dacă utilizatorul logat este un doctor
        String loggedInUserRole = authentication.getAuthorities().iterator().next().getAuthority();
        if (!loggedInUserRole.equals("ROLE_DOCTOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to add patients");
        }

        // Setați rolul implicit al pacientului
        patient.setRole(Role.PATIENT); // Asigură-te că Role este o enum sau o clasă gestionată corect

        // Criptăm parola înainte de a salva pacientul
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));

        // Salvăm pacientul în baza de date
        patientRepository.save(patient);

        return ResponseEntity.ok("Patient added successfully");
    }


    @DeleteMapping("/delete-patient/{username}")
    public ResponseEntity<?> deletePatientByUsername(@PathVariable String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loggedInUserRole = authentication.getAuthorities().iterator().next().getAuthority();

        if (!loggedInUserRole.equals("ROLE_DOCTOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete patients");
        }

        Patient patient = patientRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patientRepository.delete(patient);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return ResponseEntity.ok(doctors);
    }

    @DeleteMapping("/{doctorId}/appointments/{appointmentId}")
    public ResponseEntity<?> deleteAppointmentByDoctor(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId) {
        System.out.println("Doctor ID: " + doctorId);
        System.out.println("Appointment ID: " + appointmentId);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to delete this appointment.");
        }

        appointmentRepository.deleteById(appointmentId);
        return ResponseEntity.noContent().build();
    }



}
