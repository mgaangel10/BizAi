import { Component } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private service:UsuarioService,private router: Router){}
  
  detallesNegocios(){
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.negocioId(id!).subscribe(r=>{
      
      this.router.navigate(['/dash-board', id]);
    })
  }

  inventario(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/inventario', id]);
    
  }

  ventas(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/ventas', id]);
    
  }


}
