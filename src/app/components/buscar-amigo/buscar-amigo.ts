import { Component } from '@angular/core'; //
import { CommonModule } from '@angular/common'; // Para el ngFor
import { FormsModule } from '@angular/forms'; // 👈 ESTO ES LO QUE FALTA
import { TraduccionService } from '../../../services/traduccion.service';

@Component({
  selector: 'app-buscar-amigo',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './buscar-amigo.html',
  styleUrl: './buscar-amigo.css',
})
export class BuscarAmigo {

  busquedaNombre: string = '';
  respuestasAmigo: any[] = [];
  cargando: boolean = false;
  errorBusqueda: string = '';
  constructor(private miServicio: TraduccionService) { }

  // Borra "terminoBusqueda" y "respuestas" si no los usas,
  // usa solo "busquedaNombre" y "respuestasAmigo" para no confundirte.

buscarRespuestas() {
  if (!this.busquedaNombre.trim()) return;

  this.cargando = true;
  this.miServicio.buscarRespuestasPorAmigo(this.busquedaNombre).subscribe({
    next: (data) => {
      this.respuestasAmigo = data; // Aquí llegan las preguntas (rosa) y respuestas (gris)
      this.cargando = false;
    },
    error: (err) => {
      console.error("Error buscando amigo:", err);
      this.cargando = false;
    }
  });
}

}
