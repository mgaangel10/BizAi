export interface VentasResponse {
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
