package com.example.CeleraAi.Producto.repositorio;

import com.example.CeleraAi.Negocio.model.Negocio;
import com.example.CeleraAi.Producto.model.Producto;
import org.apache.poi.sl.draw.geom.GuideIf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductoRepo extends JpaRepository<Producto, UUID> {

    Optional<Producto>findByNombreIgnoreCaseAndNegocio(String nombre, Negocio negocio);
}
