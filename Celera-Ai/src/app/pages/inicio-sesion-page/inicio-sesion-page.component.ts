import { Component } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginResponse } from '../../model/login-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion-page',
  standalone: false,
  templateUrl: './inicio-sesion-page.component.html',
  styleUrl: './inicio-sesion-page.component.css'
})
export class InicioSesionPageComponent {

  constructor(private service:UsuarioService,private router: Router){}

  profileLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  login() {
    console.log('Datos enviados al servidor:', this.profileLogin.value);

    this.service.LoginResponseAdministrador(this.profileLogin.value.email!, this.profileLogin.value.password!)
      .subscribe((l: LoginResponse) => {
        localStorage.setItem('TOKEN', l.token);
        localStorage.setItem('USER_ID', l.id);
        this.router.navigate(['/home']);


      });
  }


}
