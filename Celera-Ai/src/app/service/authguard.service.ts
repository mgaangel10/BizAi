import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private router: Router) {}

  canActivate(): boolean {
    let token = localStorage.getItem('TOKEN');
    
    if (token) {
      // Si el token existe, permite la navegación
      return true;
    } else {
      // Si el token no existe, redirige al login y cancela la navegación
      this.router.navigate(['/login']);
      return false;
    }
  }
}
