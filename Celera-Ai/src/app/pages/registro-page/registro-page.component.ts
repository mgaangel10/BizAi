import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from '../../model/login-response';
import { UsuarioService } from '../../service/usuario.service';
import { RegisterResponse } from '../../model/register-response';

@Component({
  selector: 'app-registro-page',
  standalone: false,
  templateUrl: './registro-page.component.html',
  styleUrl: './registro-page.component.css'
})
export class RegistroPageComponent {
  constructor(private service:UsuarioService,private router: Router){}

  profileLogin = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    phoneNumber: new FormControl(''),
  })

  login() {
    console.log('Datos enviados al servidor:', this.profileLogin.value);

    this.service.register(this.profileLogin.value.email!,this.profileLogin.value.name!,this.profileLogin.value.lastName!, this.profileLogin.value.password!,this.profileLogin.value.phoneNumber!)
      .subscribe((l: RegisterResponse) => {
       
        this.router.navigate(['/login']);


      });
  }
}
