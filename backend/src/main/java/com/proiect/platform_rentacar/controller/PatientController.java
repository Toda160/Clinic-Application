package com.proiect.platform_rentacar.controller;

import com.proiect.platform_rentacar.entity.Patient;
import com.proiect.platform_rentacar.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @PostMapping("/{patientId}/review")
    public ResponseEntity<String> addReview(
            @PathVariable Long patientId,
            @RequestBody ReviewRequest reviewRequest) {
        patientService.addReviewByDoctorName(
                patientId,
                reviewRequest.getFirstname(),
                reviewRequest.getLastname(),
                reviewRequest.getRating(),
                reviewRequest.getComment()
        );
        return ResponseEntity.ok("Review added successfully");
    }
}
