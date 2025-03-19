import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { VentasResponse } from '../../model/ventas-dto';
import { DetallesNegociosResponse } from '../../model/detalles-negocios';
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
  negocioId!: string | null;
  allProductos: TodosLosProductos[] = []; // Mantiene la lista completa de productos

  page = 1;
  pageSize = 4;
  idVentaActaual!:string;
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
  
  
  

  open(content: any) {
    this.modalService.open(content, { size: 'xl', windowClass: 'custom-modal' });
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

    this.idVentaActaual = id;
    this.service.crearVenta(id).subscribe(r=>{
      this.creandoVentas = r;
      this.ventaActual();
    })
  }

  ventaActual(){
    this.service.verVentaActual(this.idVentaActaual).subscribe(r=>{
      this.creandoVentas = r;
      
    })
  }

  terminarVenta(id:string){
    this.service.terminarVenta(id).subscribe(r=>{
      this.creandoVentas = r;
      this.ventaActual
      this.ventasSemanales();
    })
  }





}
