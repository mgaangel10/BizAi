export interface ChatGPTResponse {
    accion:  Accion;
    mensaje: string;
}

export interface Accion {
    accion:           string;
    precio:           number;
    categoria:        string;
    precio_proveedor: number;
    stock:            number;
    nombre:           string;
}
