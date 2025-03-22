export interface FacturaResponse {
    id:            string;
    numeroFactura: string;
    cliente:       string;
    impuestos:     number;
    total:         number;
    subtotal:      number;
    ventaDto:      VentaDto;
}

export interface VentaDto {
    id:            string;
    detalleVentas: DetalleVenta[];
    fecha:         Date;
    total:         number;
    metodoPago:    null;
    activo:        boolean;
}

export interface DetalleVenta {
    id:             string;
    nombreProducto: string;
    precioProducto: number;
    cantida:        number;
}
