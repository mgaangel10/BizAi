import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { ActivatedRoute } from '@angular/router';

import { Color, ScaleType } from '@swimlane/ngx-charts';  // Importar Color y ScaleType

import { DetallesNegociosResponse } from '../../model/detalles-negocios';
import { ProductosMasVendidos } from '../../model/productos-mas-vendidos';
import { VentasSemanales } from '../../model/ventas-semana';
import { VentasMes } from '../../model/venta-mes';

@Component({
  selector: 'app-dash-board',
  standalone: false,
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit{
  negocioId!: string | null;
  negocios!: DetallesNegociosResponse;
  productos: ProductosMasVendidos[] = [];
  ventas!: VentasSemanales;
  ventasMes!: VentasMes;
  
  // Controlar qué gráfico mostrar
  mostrarVentasSemanales: boolean = true;  // Iniciar mostrando las ventas semanales

  constructor(private service: UsuarioService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.negocioId = params['idNegocio'];
    });
  }

  ngOnInit(): void {
    this.detallesNegocios();
    this.productosMasVendidos();
    this.ventasSemanales();
  }

  detallesNegocios() {
    this.negocioId = this.route.snapshot.paramMap.get('idNegocio');
    
    if (this.negocioId != null) {
      this.service.negocioId(this.negocioId).subscribe(r => {
        this.negocios = r;
       localStorage.setItem('NOMBRE', this.negocios.nombre);
        
      });
    }
  }

  productosMasVendidos() {
    let idNegocio = localStorage.getItem('IDNEGOCIO');
    this.service.productosMasVendidoSemana(idNegocio!).subscribe(r => {
      this.productos = r;
    });
  }

  ventasMensual() {
    let idNegocio = localStorage.getItem('IDNEGOCIO');
    if (idNegocio != null) {
      this.service.ventasMe(idNegocio).subscribe(r => {
        this.ventasMes = r;
        // Transformar datos para ngx-charts (ventas mensuales)
        this.ventasData = Object.keys(r.ventas).map(mes => ({
          name: mes,
          value: r.ventas[mes]
        }));
      });
    }
  }

  ventasSemanales() {
    let idNegocio = localStorage.getItem('IDNEGOCIO');
    if (idNegocio) {
      this.service.ventasEnSemana(idNegocio).subscribe(response => {
        this.ventas = response;

        // Transformar datos para ngx-charts (ventas semanales)
        this.ventasData = Object.keys(response.ventas).map(dia => ({
          name: dia,
          value: response.ventas[dia]
        }));
      });
    }
  }

  // Cambiar entre las ventas semanales y mensuales
  cambiarGrafico(tipo: string) {
    if (tipo === 'semanal') {
      this.mostrarVentasSemanales = true;
      this.ventasSemanales();  // Cargar ventas semanales
    } else if (tipo === 'mensual') {
      this.mostrarVentasSemanales = false;
      this.ventasMensual();  // Cargar ventas mensuales
    }
  }

  obtenerDiasSemana(): string[] {
    return ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  }

  view: [number, number] = [700, 400]; // Tamaño del gráfico

  yMax: number = 100; // Valor inicial del eje Y

  actualizarYMaximo(event: any) {
    this.yMax = event.target.value;
  }

  // Datos de ventas (semanales o mensuales dependiendo del botón presionado)
  ventasData = [
    { name: "Lunes", value: 1.0 },
    { name: "Martes", value: 0.0 },
    { name: "Miércoles", value: 0.0 },
    { name: "Jueves", value: 0.0 },
    { name: "Viernes", value: 0.0 },
    { name: "Sábado", value: 2.2 },
    { name: "Domingo", value: 0.0 }
  ];

  // Opciones del gráfico
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Semanal';
  showYAxisLabel = true;
  yAxisLabel = 'Ventas (€)';
  colorScheme: Color = {
    name: 'salesScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
}
