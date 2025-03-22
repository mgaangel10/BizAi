package com.example.CeleraAi.Venta.Dto;

import com.example.CeleraAi.Venta.model.DetalleVenta;
import com.example.CeleraAi.Venta.model.Venta;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record VentaDto(UUID id,
                       List<DetalleVentaDTo> detalleVentas,
                       LocalDate fecha,
                       double total,
                       String metodoPago,
                       boolean activo,
                       boolean terminado,
                       boolean factura) {
    public static VentaDto of (Venta v){
        return new VentaDto(
                v.getId(),
                v.getDetalleVentas().stream().map(DetalleVentaDTo::of).collect(Collectors.toList()),
                v.getFecha(),
                v.getTotalVenta(),
                v.getMetodoPago(),
                v.isActivo(),
                v.isTerminado(),
                v.isTieneFactura()
        );
    }
}
