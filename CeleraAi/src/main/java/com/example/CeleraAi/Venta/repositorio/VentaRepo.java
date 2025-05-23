package com.example.CeleraAi.Venta.repositorio;

import com.example.CeleraAi.Negocio.model.Negocio;
import com.example.CeleraAi.Venta.model.Venta;
import org.apache.catalina.Lifecycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VentaRepo extends JpaRepository<Venta, UUID> {
    Optional<Venta> findByActivoTrue();

    @Query("SELECT COALESCE(SUM(v.totalVenta), 0) FROM Venta v WHERE CAST(v.fecha AS DATE) = :fecha AND v.activo = false")
    Double calcularTotalVentasDelDia(@Param("fecha") LocalDate fecha);

    List<Venta> findByNegocioId(UUID id);

    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.detalleVentas d LEFT JOIN FETCH d.prodcuto WHERE v.negocio.id = :idNegocio")
    List<Venta> findVentasConDetallesByNegocio(@Param("idNegocio") UUID idNegocio);

    List<Venta> findByNegocioAndFecha(Negocio negocio, LocalDate fecha);

    @Query("SELECT COALESCE(SUM(v.totalVenta), 0) " +
            "FROM Venta v " +
            "WHERE v.negocio = :negocio " +
            "AND v.fecha >= :inicio " +
            "AND v.fecha < :fin")
    double totalVentasEntreFechas(
            @Param("negocio") Negocio negocio,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);

    @Query("SELECT COALESCE(SUM(v.totalVenta), 0) " +
            "FROM Venta v " +
            "WHERE v.negocio = :negocio " +
            "AND v.fecha >= :desde")
    double totalVentasDesde(
            @Param("negocio") Negocio negocio,
            @Param("desde") LocalDate desde);



}
