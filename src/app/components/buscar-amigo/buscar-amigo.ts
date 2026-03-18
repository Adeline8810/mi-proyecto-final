import { Component } from '@angular/core'; //
import { CommonModule } from '@angular/common'; // Para el ngFor
import { FormsModule } from '@angular/forms'; // 👈 ESTO ES LO QUE FALTA

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

  // Borra "terminoBusqueda" y "respuestas" si no los usas,
  // usa solo "busquedaNombre" y "respuestasAmigo" para no confundirte.

  buscarRespuestas() {
    console.log('Buscando a:', this.busquedaNombre);
    // Simulación de datos para ver el diseño rosa/gris
    this.respuestasAmigo = [
      { pregunta: '¿Cuál es tu color favorito?', respuesta: 'El rosado pastel' },
      { pregunta: '¿Qué música te gusta?', respuesta: 'Pop y baladas' }
    ];
  }

}
