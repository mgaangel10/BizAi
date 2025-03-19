import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';
import { Router } from '@angular/router';
import { VerNegocios } from '../../model/ver-negocios';

@Component({
  selector: 'app-crear-negocio',
  standalone: false,
  templateUrl: './crear-negocio.component.html',
  styleUrl: './crear-negocio.component.css'
})
export class CrearNegocioComponent {

  constructor(private service:UsuarioService,private router: Router){}

  profileLogin = new FormGroup({
    nombre: new FormControl(''),
    categorias: new FormControl(''),
    numeroEmpleados: new FormControl(),
    telefono: new FormControl(''),
    email: new FormControl(''),
    ciudad: new FormControl(''),
    pais: new FormControl(''),
    sitioweb: new FormControl(''),
  })

  login() {
    console.log('Datos enviados al servidor:', this.profileLogin.value);

    this.service.crearNegocio(this.profileLogin.value.nombre!, this.profileLogin.value.categorias!,this.profileLogin.value.numeroEmpleados!,this.profileLogin.value.telefono!,this.profileLogin.value.email!,this.profileLogin.value.ciudad!,this.profileLogin.value.pais!,this.profileLogin.value.sitioweb!)
      .subscribe((l: VerNegocios) => {
        localStorage.setItem('IDNEGOCIO', l.id);
        localStorage.setItem('NOMBRE', l.nombre);
        this.router.navigate(['/home']);


      });
  }

}
