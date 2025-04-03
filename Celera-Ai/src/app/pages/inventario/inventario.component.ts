import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { TodosLosProductos } from '../../model/todos-productos';
import { ActivatedRoute, Router } from '@angular/router';
import { DetallesNegociosResponse } from '../../model/detalles-negocios';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventario',
  standalone: false,
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{

  productos: TodosLosProductos[] = [];
  allproductos: TodosLosProductos[] = [];
  noDisponible!:TodosLosProductos;
  negocioId!: string | null;
  
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  productoId!: string | null;
  archivoSeleccionado!: File;
  mensaje: string = '';


    negocios!: DetallesNegociosResponse;
  

  constructor(private service:UsuarioService, private route: ActivatedRoute,private router: Router,config: NgbModalConfig,
		private modalService: NgbModal,) {
      config.backdrop = 'static';
		config.keyboard = false;
    this.route.params.subscribe(params => {
      this.negocioId = params['idNegocio'];
    });
  }
  ngOnInit(): void {
    this.verTodosLOsProductos();
    this.detallesNegocios();
    this.cargarProductos();
    this.detallesNegocios();
    
  }

  cargarProductos() {
    if (this.negocioId) {
      this.service.todosProductos(this.negocioId).subscribe((productos) => {
        this.allproductos = productos; // Guardamos la lista completa correctamente
        this.collectionSize = productos.length; // Total de productos
        this.refreshCountries(); // Aplicamos la paginación inicial
      });
    }
  }
  verTodosLOsProductos() {
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.todosProductos(id!).subscribe(r => {
      this.productos = r;
      this.collectionSize = r.length; // Total de productos
      this.refreshCountries();
    });
  }
  refreshCountries() {
    this.allproductos = this.productos.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

   detallesNegocios() {
    this.negocioId = this.route.snapshot.paramMap.get('idNegocio');
    if (this.negocioId != null) {
      this.service.negocioId(this.negocioId).subscribe(r => {
        this.negocios = r;
      });
    }
  }

  alfabeticamente(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.ordenarProductoAlfabeticamente(id!).subscribe(r=>{
      this.productos = r
      
      
        })
  }

  mayorStock(){
    
    this.service.productoMayorStock(this.negocioId!).subscribe(r=>{
      this.productos = r
      
        })
  }

  menorStock(){
    
    this.service.productoMeborStock(this.negocioId!).subscribe(r=>{
      this.productos = r
      
        })
  }

  mayorPrecio(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.productoMayorPrecio(id!).subscribe(r=>{
      this.productos = r
      
        })
  }

  profileLogin = new FormGroup({
    nombre: new FormControl(''),
    precio: new FormControl(),
    stock: new FormControl(),
    precioProveedor: new FormControl(),
  })

  login() {
    console.log('Datos enviados al servidor:', this.profileLogin.value);
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.crearProducto(id!,this.profileLogin.value.nombre!, this.profileLogin.value.precio!,this.profileLogin.value.stock!,this.profileLogin.value.precioProveedor!)
      .subscribe((l: TodosLosProductos) => {
        this.modalService.dismissAll()
        this.verTodosLOsProductos();
        


      });
  }

  editar() {
    console.log('Datos enviados al servidor:', this.profileLogin.value);
    
    this.service.editarProducto(this.productoId!,this.profileLogin.value.nombre!, this.profileLogin.value.precio!,this.profileLogin.value.stock!,this.profileLogin.value.precioProveedor!)
      .subscribe((l: TodosLosProductos) => {
        this.modalService.dismissAll()
        this.verTodosLOsProductos();
        


      });
  }

  ponerNoDisponible(id:string){
    this.service.ponerNoDisponible(id).subscribe(r=>{
      this.noDisponible = r;
      this.verTodosLOsProductos();
    })
  }

  open(content:any) {
		this.modalService.open(content);
	}

  open2(contentE:any,id:string) {
    this.productoId = id;
		this.modalService.open(contentE);
	}

  onFileSelected(event: any): void {
    this.archivoSeleccionado = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.archivoSeleccionado) {
      this.mensaje = 'Por favor, selecciona un archivo.';
      return;
    }

    let id = localStorage.getItem('IDNEGOCIO');

    this.service.importarProductos(this.archivoSeleccionado, id!).subscribe({
      next: (response) => {
        this.verTodosLOsProductos();
        this.mensaje = 'Productos importados exitosamente.';
      },
      error: (error) => {
        console.error(error);
        this.mensaje = 'Error al importar productos.';
      }
    });
  }





}
