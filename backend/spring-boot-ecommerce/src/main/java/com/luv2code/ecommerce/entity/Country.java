package com.luv2code.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "country")
// @Data  -- known bug with Lombok
@Getter
@Setter
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "country")
    @JsonIgnore // Pour Ignorer state dans la reponse JSON
    private List<State> states;
}
