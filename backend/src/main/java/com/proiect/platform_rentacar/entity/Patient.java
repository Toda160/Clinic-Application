package com.proiect.platform_rentacar.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Patient{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    @Enumerated(EnumType.STRING) // Salvează valorile enum ca string-uri în baza de date
    private Role role;
    private String firstname;
    private String lastname;
    private String phone;

}
