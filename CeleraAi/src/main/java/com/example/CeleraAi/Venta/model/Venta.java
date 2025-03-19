package com.example.CeleraAi.Venta.model;

import com.example.CeleraAi.Negocio.model.Negocio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String metodoPago;
    private LocalDate fecha;
    private double totalVenta;
    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "negocio_id")
    private Negocio negocio;

    @OneToMany
    private List<DetalleVenta> detalleVentas;


}
