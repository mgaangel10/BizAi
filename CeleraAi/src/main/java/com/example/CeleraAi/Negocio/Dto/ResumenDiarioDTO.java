package com.example.CeleraAi.Negocio.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResumenDiarioDTO {
    private String ventasHoy;
    private String topProducto;
    private String stockBajo;
    private String caidaVentas;
    private String prevision;
}

