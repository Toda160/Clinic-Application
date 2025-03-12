package com.proiect.platform_rentacar.controller;

import com.proiect.platform_rentacar.entity.Appointment;
import com.proiect.platform_rentacar.entity.Doctor;
import com.proiect.platform_rentacar.entity.Patient;
import com.proiect.platform_rentacar.repository.AppointmentRepository;
import com.proiect.platform_rentacar.repository.DoctorRepository;
import com.proiect.platform_rentacar.repository.PatientRepository;
import com.proiect.platform_rentacar.controller.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;


    // ----- 1. Adăugare programare -----
    @PostMapping("/add")
    public ResponseEntity<?> addAppointment(@RequestBody AppointmentRequest request) {
        // Verificăm datele primite
        if (request.getDoctorId() == null ||
                request.getPatientUsername() == null ||
                request.getDateTime() == null ||
                request.getDescription() == null) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }

        // Găsim doctorul după ID
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElse(null);
        if (doctor == null) {
            return ResponseEntity.badRequest().body("Doctor not found by ID: " + request.getDoctorId());
        }

        // Găsim pacientul după username
        Patient patient = patientRepository
                .findByUsername(request.getPatientUsername())
                .orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body("Patient not found with username: " + request.getPatientUsername());
        }

        // Construim obiectul Appointment
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setDateTime(request.getDateTime());
        appointment.setDescription(request.getDescription());
        // (Status-ul poate fi setat default sau ulterior, în funcție de logică)
        boolean alreadyExists = appointmentRepository.existsByDoctorIdAndDateTime(
                request.getDoctorId(),
                request.getDateTime()
        );
        if (alreadyExists) {
            // Poți întoarce 409 Conflict:
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("This time slot is already booked for this doctor!");
        }

        // Salvăm programarea
        appointmentRepository.save(appointment);

        return ResponseEntity.ok("Appointment added successfully");
    }


    // ----- 2. Afișarea programărilor pentru un doctor anume, după ID -----
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsForDoctor(@PathVariable Long doctorId) {
        // Verificăm dacă doctorul există
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));

        // Luăm toate programările pentru doctorul respectiv
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);

        // Construim lista de DTO (AppointmentResponse)
        List<AppointmentResponse> responseList = appointments.stream()
                .map(apt -> new AppointmentResponse(
                        apt.getId(),
                        apt.getPatient() != null
                                ? apt.getPatient().getFirstname() + " " + apt.getPatient().getLastname()
                                : "N/A",
                        apt.getDescription(),
                        apt.getDateTime(),
                        apt.getStatus()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    // ----- 3. Obținerea „busy slots” (ore ocupate) pentru un doctor, la o anumită dată -----
    @GetMapping("/doctor/{doctorId}/busy-slots")
    public ResponseEntity<List<LocalDateTime>> getBusySlots(
            @PathVariable Long doctorId,
            @RequestParam String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndDay(doctorId, startOfDay, endOfDay);

        List<LocalDateTime> busySlots = appointments.stream()
                .map(Appointment::getDateTime)
                .collect(Collectors.toList());

        return ResponseEntity.ok(busySlots);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found with ID: " + id);
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    // ----- 4. Returnarea listei de doctori -----
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> allDocs = doctorRepository.findAll();
        return ResponseEntity.ok(allDocs);
    }
    // ----- 5. Afișarea programărilor active pentru un pacient după username -----
    @GetMapping("/patient/{username}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsForPatient(@PathVariable String username) {
        // Verificăm dacă pacientul există
        Patient patient = patientRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient not found with username: " + username));

        // Luăm toate programările pentru pacientul respectiv
        List<Appointment> appointments = appointmentRepository.findByPatientUsername(username);

        // Construim lista de DTO (AppointmentResponse)
        List<AppointmentResponse> responseList = appointments.stream()
                .map(apt -> new AppointmentResponse(
                        apt.getId(),
                        apt.getDoctor() != null
                                ? apt.getDoctor().getFirstname() + " " + apt.getDoctor().getLastname() // Numele doctorului
                                : "N/A",
                        apt.getDescription(),
                        apt.getDateTime(),
                        apt.getStatus()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }
}
