import { Injectable } from '@angular/core';
import { LoginResponse } from '../model/login-response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerNegocios } from '../model/ver-negocios';
import { DetallesNegociosResponse, VentaDto } from '../model/detalles-negocios';
import { ProductosMasVendidos } from '../model/productos-mas-vendidos';
import { VentasSemanales } from '../model/ventas-semana';
import { VentasMes } from '../model/venta-mes';
import { TodosLosProductos } from '../model/todos-productos';
import { VentasResponse } from '../model/ventas-dto';
import { FacturaResponse } from '../model/factura-response';
import { VerFacturas } from '../model/ver-facturas';
import { ChatGPTResponse } from '../model/gpt-response';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  url='http://localhost:9000';

  LoginResponseAdministrador(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/auth/login/user`,
      {
        "email": `${email}`,
        "password": `${password}`
      });
  }


  verNegocios():Observable<VerNegocios[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VerNegocios[]>(`${this.url}/usuario/ver/negocios/usuarios`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  crearNegocio(nombre:string,categorias:string,numeroEmpleados:number,telefono:string,email:string,ciudad:string,pais:string,sitioweb:string):Observable<VerNegocios>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<VerNegocios>(`${this.url}/usuario/crear/negocio`,{
      "nombre": `${nombre}`,
        "categorias": `${categorias}`,
        "numeroEmpleados": `${numeroEmpleados}`,
        "telefono": `${telefono}`,
        "email": `${email}`,
        "ciudad": `${ciudad}`,
        "pais": `${pais}`,
        "sitioweb": `${sitioweb}`

    }, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  negocioId(id:string):Observable<DetallesNegociosResponse>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<DetallesNegociosResponse>(`${this.url}/usuario/negocio/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  productosMasVendidoSemana(id:string):Observable<ProductosMasVendidos[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<ProductosMasVendidos[]>(`${this.url}/usuario/producto/mas/vendido/semana/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  ventasEnSemana(id:string):Observable<VentasSemanales>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VentasSemanales>(`${this.url}/usuario/ventas/semana/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  ventasMe(id:string):Observable<VentasMes>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VentasMes>(`${this.url}/usuario/ventas/mes/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  crearProducto(id:string,nombre:string,precio:number,stock:number,precioProveedor:number):Observable<TodosLosProductos>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<TodosLosProductos>(`${this.url}/usuario/crear/producto/${id}`,{
      "nombre": `${nombre}`,
        "precio": `${precio}`,
        "stock": `${stock}`,
        "precioProveedor": `${precioProveedor}`,
     

    }, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  todosProductos(id:string):Observable<TodosLosProductos[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<TodosLosProductos[]>(`${this.url}/usuario/ver/productos/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  ordenarProductoAlfabeticamente(id:string):Observable<TodosLosProductos[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<TodosLosProductos[]>(`${this.url}/usuario/producto/alfabeticamente/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  productoMayorPrecio(id:string):Observable<TodosLosProductos[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<TodosLosProductos[]>(`${this.url}/usuario/producto/mayor/precio/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  productoMayorStock(id:string):Observable<TodosLosProductos[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<TodosLosProductos[]>(`${this.url}/usuario/producto/mayor/stock/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  productoMeborStock(id:string):Observable<TodosLosProductos[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<TodosLosProductos[]>(`${this.url}/usuario/producto/menor/stock/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  detallesVentasSemanal(id:string):Observable<VentasResponse[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VentasResponse[]>(`${this.url}/usuario/ventas/totales/semanas/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  crearVenta(id:string):Observable<VentasResponse>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<VentasResponse>(`${this.url}/usuario/agregar/producto/venta/${id}`,{

    }, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  verVentaActual(id:string):Observable<VentasResponse>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VentasResponse>(`${this.url}/usuario/ver/venta/actual/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  terminarVenta(id:string):Observable<VentaDto>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<VentaDto>(`${this.url}/usuario/terminar/venta/${id}`,{}, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  crearFactura(id:string,numeroFacura:string,cliente:string,impuestos:number,numeroAlbaran:number):Observable<FacturaResponse>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<FacturaResponse>(`${this.url}/usuario/crear/factura/${id}`,{
      "numeroFacura": `${numeroFacura}`,
      "cliente": `${cliente}`,
      "impuestos": `${impuestos}`,
      "numeroAlbaran": `${numeroAlbaran}`
      
    }, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  ventasSinFacturas(id:string):Observable<VentaDto[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VentaDto[]>(`${this.url}/usuario/ver/ventas/sin/factura/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  VerFacturas(id:string):Observable<VerFacturas[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VerFacturas[]>(`${this.url}/usuario/ver/facturas/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  VerDetallesFacturas(id:string):Observable<VerFacturas>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VerFacturas>(`${this.url}/usuario/ver/detalles/de/factura/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  preguntarAsistente(pregunta:string,id:string):Observable<ChatGPTResponse>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<ChatGPTResponse>(`${this.url}/usuario/generarRecomendaciones/${id}`,{
      "pregunta": `${pregunta}`,
    }, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  verTodasVentas(id:string):Observable<VentaDto[]>{
    let token = localStorage.getItem('TOKEN');
    return this.http.get<VentaDto[]>(`${this.url}/usuario/ver/todas/ventas/${id}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  editarVenta(idV:string,idP:string):Observable<VentaDto>{
    let token = localStorage.getItem('TOKEN');
    return this.http.post<VentaDto>(`${this.url}/usuario/añadir/mas/productos/ventas/${idV}/${idP}`,{
      
    }, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

 //hehehe

 ventasPorDate(id:string):Observable<VentaDto[]>{
  let token = localStorage.getItem('TOKEN');
  return this.http.get<VentaDto[]>(`${this.url}/usuario/filtrar/ventas/date/${id}`, {
    headers: {
      accept: 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

ventasConFactura(id:string):Observable<VentaDto[]>{
  let token = localStorage.getItem('TOKEN');
  return this.http.get<VentaDto[]>(`${this.url}/usuario/filtrar/ventas/factura/${id}`, {
    headers: {
      accept: 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

ventasEditables(id:string):Observable<VentaDto[]>{
  let token = localStorage.getItem('TOKEN');
  return this.http.get<VentaDto[]>(`${this.url}/usuario/filtrar/ventas/editable/${id}`, {
    headers: {
      accept: 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

ventasConTotalVentas(id:string):Observable<VentaDto[]>{
  let token = localStorage.getItem('TOKEN');
  return this.http.get<VentaDto[]>(`${this.url}/usuario/filtrar/ventas/total/${id}`, {
    headers: {
      accept: 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}



}
