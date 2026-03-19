import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraduccionService } from '../../../services/traduccion.service';

@Component({
  selector: 'app-buscar-amigo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-amigo.html',
  styleUrl: './buscar-amigo.css',
})
export class BuscarAmigo {
  busquedaNombre: string = '';
  amigosEncontrados: any[] = []; // Almacena la lista de personas
  respuestasAmigo: any[] = [];   // Almacena el SLAM del amigo elegido
  cargando: boolean = false;
  mostrarSlam: boolean = false;  // Controla qué vista mostrar

  constructor(private miServicio: TraduccionService) { }

  // PASO 1: Buscar coincidencias de nombres/usuarios
  buscarAmigos() {
    if (!this.busquedaNombre.trim()) return;

    this.cargando = true;
    this.mostrarSlam = false;
    this.amigosEncontrados = [];

    this.miServicio.buscarUsuarios(this.busquedaNombre).subscribe({
      next: (data) => {
        this.amigosEncontrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error buscando usuarios:", err);
        this.cargando = false;
      }
    });
  }

  // PASO 2: Cargar el SLAM de la persona seleccionada
  verSlam(amigo: any) {
    this.cargando = true;
    // Usamos el nombre exacto para que no salgan duplicados
    this.miServicio.buscarRespuestasPorAmigo(amigo.nombre).subscribe({
      next: (data) => {
        this.respuestasAmigo = data;
        this.mostrarSlam = true;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error cargando SLAM:", err);
        this.cargando = false;
      }
    });
  }

  volverALista() {
    this.mostrarSlam = false;
  }
}
