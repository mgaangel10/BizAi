// ventas-semanales.model.ts
export interface VentasSemanales {
    semana: string;
    ventas: Ventas;
  }
  
  export interface Ventas {
    [key: string]: number;  // Esto permite que accedas a las propiedades con cualquier clave de tipo string
  }
  