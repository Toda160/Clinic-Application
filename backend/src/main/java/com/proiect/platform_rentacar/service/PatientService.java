package com.proiect.platform_rentacar.service;

import com.proiect.platform_rentacar.entity.Doctor;
import com.proiect.platform_rentacar.entity.Patient;
import com.proiect.platform_rentacar.entity.Review;
import com.proiect.platform_rentacar.repository.DoctorRepository;
import com.proiect.platform_rentacar.repository.PatientRepository;
import com.proiect.platform_rentacar.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ReviewRepository reviewRepository;

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public void addReviewByDoctorName(Long patientId, String firstname, String lastname, int rating, String comment) {
        // Verifică existența pacientului
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Verifică existența doctorului după nume
        Doctor doctor = doctorRepository.findByFirstnameAndLastname(firstname, lastname)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Creează și salvează review-ul
        Review review = new Review();
        review.setPatient(patient);
        review.setDoctor(doctor);
        review.setRating(rating);
        review.setComment(comment);

        reviewRepository.save(review);
    }
}
