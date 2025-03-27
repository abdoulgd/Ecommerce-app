package com.luv2code.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "state")
@Data
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class State {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
}
