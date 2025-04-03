import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosMasVendidos } from '../../model/productos-mas-vendidos';

@Component({
  selector: 'app-estadisticas',
  standalone: false,
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit{
  nombre!: string; 
  negocioId!: string | null;
  prodcutos: ProductosMasVendidos [] = [];
  chartData: any[] = [];
  ingresos!:number;
  gastos!:number;
  beneficio!:number;


  // Configuración del gráfico
  view: [number, number] = [300, 400]; // Tamaño del gráfico
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Productos';
  showYAxisLabel = true;
  yAxisLabel = 'Precio (€)';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  constructor(private service:UsuarioService, private route: ActivatedRoute,
    private router: Router,){}


  ngOnInit(): void {
    this.nombre = localStorage.getItem('NOMBRE') || '';
    this.negocioId = this.route.snapshot.paramMap.get('idNegocio');
    this.productosMasVendidosMes();
    this.verIngresos();
    this.verGastos();
    this.verBeneficio();
  }

  productosMasVendidosMes(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.productosMasVendidoMes(id!).subscribe(r=>{
      this.prodcutos = r;
      this.chartData = this.prodcutos.map(prod => ({
        name: prod.nombre,
        value: prod.precio // Puedes cambiarlo por stock u otro valor si lo deseas
      }));
    })
  }

  verIngresos(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.verIngresos(id!).subscribe(r=>{
      this.ingresos = r;
    })
  }

  verGastos(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.verGastos(id!).subscribe(r=>{
      this.gastos = r;
    })
  }

  verBeneficio(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.verBeneficio(id!).subscribe(r=>{
      this.beneficio = r;
    })
  }
  

}
