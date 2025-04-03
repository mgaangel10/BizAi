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

  menuItems = [
    {
      label: 'Home',
      icon: 'bi bi-house-door-fill',
      action: () => this.detallesNegocios()
    },
    {
      label: 'Inventario',
      icon: 'bi bi-archive',
      action: () => this.inventario()
    },
    {
      label: 'Ventas',
      icon: 'bi bi-wallet',
      action: () => this.ventas()
    },
    {
      label: 'Facturar',
      icon: 'bi bi-layout-text-window-reverse',
      action: () => this.facturas()
    },
    {
      label: 'Estadísticas',
      icon: 'bi bi-bar-chart-line',
      action: () => this.estadisticas()
    },
    {
      label: 'Asistente',
      icon: 'bi bi-slack',
      action: () => this.asistente()
    }
  ];
  

  inventario(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/inventario', id]);
    
  }

  ventas(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/ventas', id]);
    
  }

  facturas(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/facturar', id]);
    
  }

  asistente(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/asistente', id]);
    
  }
  estadisticas(){
    let id = localStorage.getItem('IDNEGOCIO');
    
      
      this.router.navigate(['/estadisticas', id]);
    
  }


}
