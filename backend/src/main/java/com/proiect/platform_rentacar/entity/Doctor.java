package com.proiect.platform_rentacar.entity;


import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Doctor{
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

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }


    public void setPhone(String phone) {
        this.phone = phone;
    }
}
