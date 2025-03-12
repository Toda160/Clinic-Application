package com.proiect.platform_rentacar.service;


import com.proiect.platform_rentacar.entity.Doctor;
import com.proiect.platform_rentacar.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    public Doctor postDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
    }
}
