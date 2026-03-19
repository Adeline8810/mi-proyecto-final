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
// ... (imports y decorador @Component)
export class BuscarAmigo {
  busquedaNombre: string = '';
  amigosEncontrados: any[] = [];
  respuestasAmigo: any[] = [];
  cargando: boolean = false;
  mostrarSlam: boolean = false;

  constructor(private miServicio: TraduccionService) { }

  buscarAmigos() {
    if (!this.busquedaNombre.trim()) return;

    this.cargando = true;
    this.mostrarSlam = false;

    // 🔥 IMPORTANTE: Limpiar los arrays antes de una nueva búsqueda
    this.amigosEncontrados = [];
    this.respuestasAmigo = [];

    this.miServicio.buscarUsuarios(this.busquedaNombre).subscribe({
      next: (data) => {
        this.amigosEncontrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error:", err);
        this.cargando = false;
      }
    });
  }

  verSlam(amigo: any) {
    this.cargando = true;

    // 🔥 CLAVE PARA EVITAR DUPLICADOS:
    // Limpiamos la lista de amigos encontrados para que solo quede el SLAM
    this.amigosEncontrados = [];
    this.respuestasAmigo = [];

    // Buscamos solo por el nombre exacto del amigo seleccionado
    this.miServicio.buscarRespuestasPorAmigo(amigo.nombre).subscribe({
      next: (data) => {
        this.respuestasAmigo = data;
        this.mostrarSlam = true; // Esto activa la vista del cuestionario en el HTML
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
    this.respuestasAmigo = []; // Limpiamos al salir
    // Opcional: podrías volver a ejecutar buscarAmigos() aquí
    // si quieres que la lista de búsqueda reaparezca.
  }
}
