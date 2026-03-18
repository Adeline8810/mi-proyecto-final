import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreguntaService } from '../../../services/pregunta.service';
import { RespuestaService } from '../../../services/respuesta.service';
import { Pregunta } from '../../../models/pregunta';
import { Respuesta } from '../../../models/respuesta';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-slam',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuBarComponent],
  templateUrl: './slam.component.html',
  styleUrls: ['./slam.component.css']
})
export class SlamComponent implements OnInit {
  preguntas: Pregunta[] = [];
  respuestas: Respuesta[] = [];
  preguntaActual = 0;
  respuestaActual = '';
  fotoFile: File | null = null;
  fotoPreview: string | null = null;
  completado = false;
  usuarioId!: number; // ✅ Ahora siempre será number después de la verificación
  nombreUsuario: string = '';

  constructor(private preguntaService: PreguntaService, private respuestaService: RespuestaService) {}

  ngOnInit(): void {
    const u = localStorage.getItem('usuario');
    if (!u) {
      alert('Debes iniciar sesión');
      return;
    }

    const usuarioObj = JSON.parse(u);
    this.usuarioId = usuarioObj.id;
    this.nombreUsuario = usuarioObj.nombre;

    this.usuarioId = JSON.parse(u).id;

    // ⚡ Cargar preguntas y respuestas existentes en paralelo
    forkJoin({
      preguntas: this.preguntaService.obtenerPreguntas(),
      respuestas: this.respuestaService.obtenerRespuestasPorUsuario(this.usuarioId)
    }).subscribe({
      next: ({ preguntas, respuestas }) => {
        this.preguntas = preguntas;

        // Mapear respuestas existentes
        this.respuestas = preguntas.map(q => {
          const rExistente = respuestas.find(r => r.preguntaId === q.id);
          return {
            id: rExistente?.id,
            preguntaId: q.id,
            usuarioId: this.usuarioId,
            texto: rExistente?.texto || null,
            fotoUrl: rExistente?.fotoUrl || null
          };
        });

        // Inicializar respuesta actual y previsualización
        if (this.respuestas.length) {
          this.preguntaActual = 0;
          this.respuestaActual = this.respuestas[0].texto || '';
          this.fotoPreview = this.respuestas[0].fotoUrl || null;
        }
      },
      error: err => console.error(err)
    });




  }

  onFotoSeleccionada(ev: any) {
    const f: File = ev.target.files && ev.target.files[0];
    if (!f) return;
    this.fotoFile = f;
    const reader = new FileReader();
    reader.onload = (e) => this.fotoPreview = (e.target as any).result;
    reader.readAsDataURL(f);
  }

  anterior() {
    this.respuestas[this.preguntaActual].texto = this.respuestaActual || null;
    if (this.preguntaActual > 0) {
      this.preguntaActual--;
      this.respuestaActual = this.respuestas[this.preguntaActual].texto || '';
      this.fotoPreview = this.respuestas[this.preguntaActual].fotoUrl || null;
    }
  }

  pasar() {
    this.respuestas[this.preguntaActual].texto = null;
    this.siguiente();
  }

  siguiente() {
    this.respuestas[this.preguntaActual].texto = this.respuestaActual || null;

    if (this.preguntaActual < this.preguntas.length - 1) {
      this.preguntaActual++;
      this.respuestaActual = this.respuestas[this.preguntaActual].texto || '';
      this.fotoPreview = this.respuestas[this.preguntaActual].fotoUrl || null;

      // Animación opcional de "bounce"
      const title = document.querySelector('.slam-title');
      if (title) {
        title.classList.add('bounce');
        setTimeout(() => title.classList.remove('bounce'), 300);
      }
    } else {
      this.guardarTodo();
    }
  }

 async guardarTodo() {
    // 1. IMPORTANTE: Guardar el texto de la última pregunta en el array antes de enviar
    this.respuestas[this.preguntaActual].texto = this.respuestaActual || null;

    try {
      // Manejo de foto (tu código actual está bien)
      if (this.fotoFile) {
        const url = await firstValueFrom(this.respuestaService.subirFoto(this.fotoFile));
        this.respuestas[this.preguntaActual].fotoUrl = url; // Se la asignamos a la actual
      }
    } catch (err) {
      console.error('Error foto:', err);
    }

    // 2. Enviar el payload
    this.respuestaService.guardarRespuestas(this.respuestas).subscribe({
      next: () => {
        this.completado = true;
        // Opcional: limpiar el storage o redirigir
      },
      error: err => {
        console.error('Error 404 o 500:', err);
        alert('Hubo un error al conectar con el servidor');
      }
    });
}
}
