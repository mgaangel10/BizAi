export interface DetallesNegociosResponse {
    id:              string;
    nombre:          string;
    categoria:       string;
    numeroEmpleados: number;
    telefono:        string;
    email:           string;
    ciudad:          string;
    pais:            string;
    sitioweb:        string;
    productoDtos:    ProductoDto[];
    ventaDtos:       VentaDto[];
}

export interface ProductoDto {
    id:              string;
    nombre:          string;
    precio:          number;
    stock:           number;
    precioProveedor: number;
}

export interface VentaDto {
    id:            string;
    detalleVentas: DetalleVenta[];
    fecha:         Date;
    total:         number;
    metodoPago:    null;
    activo:        boolean;
    terminado:        boolean;
    factura:        boolean;
}

export interface DetalleVenta {
    id:             string;
    nombreProducto: string;
    precioProducto: number;
    cantida:        number;
}
