import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { VentasResponse } from '../../model/ventas-dto';
import { DetallesNegociosResponse, VentaDto } from '../../model/detalles-negocios';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TodosLosProductos } from '../../model/todos-productos';

@Component({
  selector: 'app-ventas',
  standalone: false,
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: VentasResponse[] = [];
  creandoVentas!: VentasResponse ;
  nombre!: string; 
   mostrarAlerta: boolean = false;

  negocioId!: string | null;
  allProductos: TodosLosProductos[] = []; // Mantiene la lista completa de productos
  todasVentas:VentaDto[] = [];
  idVenta!:string;
  page = 1;
  pageSize = 4;
  idProductoActual!:string;
  collectionSize = 0;
  productos: TodosLosProductos[] = [];
  negocios!: DetallesNegociosResponse;

  constructor(
    private service: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.nombre = localStorage.getItem('NOMBRE') || '';
    this.negocioId = this.route.snapshot.paramMap.get('idNegocio');
    this.ventasSemanales();
    this.cargarProductos();
    this.verTodasVentas();
    
  }

  cargarProductos() {
    if (this.negocioId) {
      this.service.todosProductos(this.negocioId).subscribe((productos) => {
        this.allProductos = productos; // Guardamos la lista completa correctamente
        this.collectionSize = productos.length; // Total de productos
        this.refreshCountries(); // Aplicamos la paginación inicial
      });
    }
  }
  

  refreshCountries() {
    this.productos = this.allProductos.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
  
  verTodasVentas(){
    this.service.verTodasVentas(this.negocioId!).subscribe(r=>{
      this.todasVentas = r
    })
  }

  editarVenta(idP:string){
    
    this.service.editarVenta(this.idVenta,idP).subscribe(r=>{
      this.creandoVentas = r;
      this.ventaActual();
    })
  }
  
  

  open(content: any) {
    this.modalService.open(content, { size: 'xl', windowClass: 'custom-modal' });
  }
  open2(contentE: any, v:VentaDto) {
    this.idVenta = v.id;
    if (v.terminado) {
      this.mostrarAlerta = false;
     return setTimeout(() => {
        this.mostrarAlerta = true;
      }, 10); 
    }else{

      return this.modalService.open(contentE, { size: 'xl', windowClass: 'custom-modal' });
    }
  }
  

  ventasSemanales() {
    let id = localStorage.getItem('IDNEGOCIO');
    if (id) {
      this.service.detallesVentasSemanal(id).subscribe((r) => {
        this.ventas = r;
      });
    }
  }

  crearVenta(id:string){

    this.idProductoActual = id;
    this.service.crearVenta(id).subscribe(r=>{
      this.creandoVentas = r;
      this.idVenta = r.id;
      this.ventaActual();
    })
  }

  ventaActual(){
    this.service.verVentaActual(this.idVenta).subscribe(r=>{
      this.creandoVentas = r;
      
    })
  }

  terminarVenta(id:string){
    this.service.terminarVenta(id).subscribe(r=>{
      this.creandoVentas = r;
      this.verTodasVentas();
      this.ventaActual();
      this.ventasSemanales();
    })
  }

  ventasConFactura(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.ventasConFactura(id!).subscribe(r=>{
      this.todasVentas = r;
    })
  }

  ventasEditables(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.ventasEditables(id!).subscribe(r=>{
      this.todasVentas = r;
    })
  }


  ventasTotaVentas(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.ventasConTotalVentas(id!).subscribe(r=>{
      this.todasVentas = r;
    })
  }

  





}
