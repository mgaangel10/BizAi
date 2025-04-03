import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { VerNegocios } from '../../model/ver-negocios';
import { DetallesNegociosResponse } from '../../model/detalles-negocios';
import { Router } from '@angular/router';
import { LoginResponse } from '../../model/login-response';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{

  negocios:VerNegocios [] = [];
  detallesN!:DetallesNegociosResponse;
  loginResponse!:LoginResponse;

  constructor(private service:UsuarioService,private router: Router){}

  ngOnInit(): void {
    this.verNegocios();
    this.informacionUsuario();
  }

  verNegocios(){
    this.service.verNegocios().subscribe(r=>{
      this.negocios = r;
    })
  }
  informacionUsuario(){
    this.service.informacionUsuario().subscribe(r=>{
      this.loginResponse = r;
    })
  }
  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  detallesNegocios(id:string){
    this.service.negocioId(id).subscribe(r=>{
      localStorage.setItem('IDNEGOCIO', id);
      this.router.navigate(['/dash-board', id]);
    })
  }

}
