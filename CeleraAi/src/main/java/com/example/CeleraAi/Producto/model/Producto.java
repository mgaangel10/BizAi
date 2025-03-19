package com.example.CeleraAi.Producto.model;

import com.example.CeleraAi.Negocio.model.Negocio;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nombre;

    private double precio;
    private int stock;
    private double precioProveedor;
    @ManyToOne
    private Negocio negocio;


}
