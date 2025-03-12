package com.proiect.platform_rentacar.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Adaugă câmpuri comune pentru firstname, lastname, phone
    private String firstname;
    private String lastname;
    private String phone;
}
