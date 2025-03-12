package com.proiect.platform_rentacar.controller;

import com.proiect.platform_rentacar.config.JwtTokenProvider;
import com.proiect.platform_rentacar.entity.Doctor;
import com.proiect.platform_rentacar.entity.Patient;
import com.proiect.platform_rentacar.entity.Role;
import com.proiect.platform_rentacar.entity.User;
import com.proiect.platform_rentacar.repository.DoctorRepository;
import com.proiect.platform_rentacar.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Verifică dacă username-ul există deja
        if (doctorRepository.findByUsername(user.getUsername()).isPresent() ||
                patientRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        // Criptează parola
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Salvează în funcție de rol
        if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUsername(user.getUsername());
            doctor.setPassword(user.getPassword());
            doctor.setRole(user.getRole());
            doctor.setFirstname(user.getFirstname());
            doctor.setLastname(user.getLastname());
            doctor.setPhone(user.getPhone());
            doctorRepository.save(doctor);
            return ResponseEntity.ok("Doctor registered successfully");
        } else if (user.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUsername(user.getUsername());
            patient.setPassword(user.getPassword());
            patient.setRole(user.getRole());
            patient.setFirstname(user.getFirstname());
            patient.setLastname(user.getLastname());
            patient.setPhone(user.getPhone());
            patientRepository.save(patient);
            return ResponseEntity.ok("Patient registered successfully");
        }

        // Dacă rolul nu este valid
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role specified");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        System.out.println("Login attempt for username: " + user.getUsername());

        try {
            // 1. Verifică dacă este doctor
            Optional<Doctor> doctorOpt = doctorRepository.findByUsername(user.getUsername());
            if (doctorOpt.isPresent()) {
                Doctor doctor = doctorOpt.get();
                System.out.println("Doctor found: " + doctor.getUsername());

                // Compară parola criptată
                if (passwordEncoder.matches(user.getPassword(), doctor.getPassword())) {
                    // Generează token
                    String token = jwtTokenProvider.generateToken(doctor.getUsername(), "DOCTOR");
                    System.out.println("Token generated for doctor: " + token);

                    // Trimite și id‐ul în response
                    return ResponseEntity.ok(Map.of(
                            "id", doctor.getId(),
                            "username", doctor.getUsername(),
                            "role", "DOCTOR",
                            "token", token
                    ));
                } else {
                    System.out.println("Invalid password for doctor: " + user.getUsername());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password for Doctor");
                }
            }

            // 2. Verifică dacă este pacient
            Optional<Patient> patientOpt = patientRepository.findByUsername(user.getUsername());
            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                System.out.println("Patient found: " + patient.getUsername());

                if (passwordEncoder.matches(user.getPassword(), patient.getPassword())) {
                    String token = jwtTokenProvider.generateToken(patient.getUsername(), "PATIENT");
                    System.out.println("Token generated for patient: " + token);

                    return ResponseEntity.ok(Map.of(
                            "id", patient.getId(),
                            "username", patient.getUsername(),
                            "role", "PATIENT",
                            "token", token
                    ));
                } else {
                    System.out.println("Invalid password for patient: " + user.getUsername());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password for Patient");
                }
            }

            // 3. Nici doctor, nici pacient
            System.out.println("User not found: " + user.getUsername());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

}
