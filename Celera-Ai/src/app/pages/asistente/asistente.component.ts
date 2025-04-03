import { Component, OnInit } from '@angular/core';
import { ChatGPTResponse } from '../../model/gpt-response';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-asistente',
  standalone: false,
  templateUrl: './asistente.component.html',
  styleUrl: './asistente.component.css'
})
export class AsistenteComponent implements OnInit{

  respuesta!: ChatGPTResponse;
  nombre!: string;

  constructor(private service: UsuarioService) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('NOMBRE') || '';  
  }

  profileLogin = new FormGroup({
    pregunta: new FormControl(''),
  });

  preguntar() {
    
    console.log('Datos enviados al servidor:', this.profileLogin.value);
    let id = localStorage.getItem('IDNEGOCIO');
    this.service.preguntarAsistente(this.profileLogin.value.pregunta!, id!)
      .subscribe((response: ChatGPTResponse) => {

        if (response && response.mensaje && response.mensaje != null) {
          this.respuesta = response;
        }
      });
  }
}
