package com.proiect.platform_rentacar.controller;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String doctorName; // Numele doctorului
    private String description;
    private LocalDateTime dateTime;
    private String status; // Statusul programării
}
