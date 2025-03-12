package com.proiect.platform_rentacar.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    @ManyToOne
    @JoinColumn(name = "doctor_id") // Creează o coloană pentru a lega doctorul
    private Doctor doctor;
    @ManyToOne
    private Patient patient;

    private String description;

    private LocalDateTime dateTime;

    private String status; // De exemplu: "Pending", "Approved", "Rejected"
}
