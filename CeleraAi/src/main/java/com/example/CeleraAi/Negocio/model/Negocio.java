package com.example.CeleraAi.Negocio.model;

import com.example.CeleraAi.Producto.model.Producto;
import com.example.CeleraAi.Venta.model.Venta;
import com.example.CeleraAi.users.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Negocio {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String nombre;
    private int numeroEmpleados;

    private String telefono;
    private String email;

    private String ciudad;
    private String pais;

    private String sitioweb;

    @ManyToOne
    private Categorias categorias;

    @ManyToOne
    private Usuario usuario;

    @OneToMany
    private List<Producto> prodcutos;

    @OneToMany(mappedBy = "negocio")
    private List<Venta> ventas;


}
