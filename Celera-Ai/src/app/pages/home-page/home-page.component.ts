import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { VerNegocios } from '../../model/ver-negocios';
import { DetallesNegociosResponse } from '../../model/detalles-negocios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{

  negocios:VerNegocios [] = [];
  detallesN!:DetallesNegociosResponse;

  constructor(private service:UsuarioService,private router: Router){}

  ngOnInit(): void {
    this.verNegocios();
  }

  verNegocios(){
    this.service.verNegocios().subscribe(r=>{
      this.negocios = r;
    })
  }

  detallesNegocios(id:string){
    this.service.negocioId(id).subscribe(r=>{
      localStorage.setItem('IDNEGOCIO', id);
      this.router.navigate(['/dash-board', id]);
    })
  }

}
