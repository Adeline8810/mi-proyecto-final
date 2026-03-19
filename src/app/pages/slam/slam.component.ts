import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreguntaService } from '../../../services/pregunta.service';
import { RespuestaService } from '../../../services/respuesta.service';
import { Pregunta } from '../../../models/pregunta';
import { Respuesta } from '../../../models/respuesta';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { forkJoin, firstValueFrom } from 'rxjs';
import { TraduccionService } from '../../../services/traduccion.service';
import confetti from 'canvas-confetti';

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
  fotoUrlServidor: string | null = null;
  idiomaSeleccionado = 'es';
  preguntasTraducidas: { [key: string]: { [id: number]: string } } = {};
  cargandoTraduccion = false;

  cargando: boolean = false;

  constructor(private preguntaService: PreguntaService, private respuestaService: RespuestaService,
    private traduccionService: TraduccionService) {}

  ngOnInit(): void {
    const u = localStorage.getItem('usuario');
    const fotoGuardada = localStorage.getItem('user_foto_perfil');
    if (fotoGuardada) {
    // Si existe, se la asignamos a la variable que muestra la imagen en el HTML
    this.fotoUrlServidor = fotoGuardada;
    // Si estás en el formulario del Slam, asígnale la URL a la respuesta actual
    this.respuestas[this.preguntaActual].fotoUrl = fotoGuardada;
  }

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
    this.obtenerTraduccionActual();
  }

  pasar() {
    this.respuestas[this.preguntaActual].texto = null;
    this.siguiente();
  }

  siguiente() {

    this.lanzarChispitas();
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

    this.obtenerTraduccionActual();
  }


lanzarChispitas() {
    const duration = 2 * 1000; // 2 segundos de chispitas
    const end = Date.now() + duration;

    const frame = () => {
      // Colores: Rosa fuerte, Blanco y Rosa pastel (como tu SLAM)
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }, // Salen de la izquierda
        colors: ['#ff4a68', '#ffffff', '#ffe6eb']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }, // Salen de la derecha
        colors: ['#ff4a68', '#ffffff', '#ffe6eb']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }




 async guardarTodo() {
  // 1. Guardar el texto de la última pregunta en el array
  this.respuestas[this.preguntaActual].texto = this.respuestaActual || null;

  try {
    if (this.fotoFile) {
      // LLAMADA AL BACKEND: Obtenemos el "publicPath" (ej: /uploads/imagen.jpg)
      const pathRelativo = await firstValueFrom(this.respuestaService.subirFoto(this.fotoFile));

      // CAMBIO IMPORTANTE: Construimos la URL completa para que Angular pueda mostrarla
      // Usamos la variable 'api' de tu servicio pero apuntando a la raíz del servidor
      const urlCompleta = `https://backend-cloudv2-production-1443.up.railway.app${pathRelativo}`;

      // Asignamos la URL completa a la respuesta
      this.respuestas[this.preguntaActual].fotoUrl = urlCompleta;

      console.log('Foto disponible en:', urlCompleta);
    }
  } catch (err) {
    console.error('Error al subir foto:', err);
  }

  // 2. Enviar el payload final con todas las respuestas y la URL de la foto
  this.respuestaService.guardarRespuestas(this.respuestas).subscribe({
    next: () => {
      this.completado = true;

      // SOLUCIÓN AL ERROR DE TYPESCRIPT (Subrayado rojo)
      const fotoFinal = this.respuestas[this.preguntaActual].fotoUrl;
      if (fotoFinal) {
        // Guardamos la URL completa en el storage para usarla en otras pantallas
        localStorage.setItem('user_foto_perfil', fotoFinal);
      }
    },
    error: err => {
      console.error('Error al conectar con el servidor:', err);
      alert('Hubo un error al guardar los datos.');
    }
  });
}




// Método para cambiar idioma
cambiarIdioma(lang: string) {
  this.idiomaSeleccionado = lang;
  this.preguntasTraducidas = {}; // Limpiamos caché al cambiar de idioma
  this.obtenerTraduccionActual();
}



obtenerTraduccionActual() {
  const pregunta = this.preguntas[this.preguntaActual];
  const idPregunta = pregunta.id;
  const lang = this.idiomaSeleccionado;

  // 1. Si es español, mostramos el original y salimos
  if (lang === 'es') {
    this.cargando = false;
    return;
  }

  // 2. Si YA tenemos esta pregunta en ESTE idioma, no llamamos al servidor
  if (this.preguntasTraducidas[lang] && this.preguntasTraducidas[lang][idPregunta]) {
    this.cargando = false;
    return;
  }

  // 3. Si no la tenemos, activamos el reloj y pedimos al Backend
  this.cargando = true;
  this.traduccionService.traducir(pregunta.texto, lang).subscribe({
    next: (res) => {
      // Inicializamos el objeto del idioma si no existe
      if (!this.preguntasTraducidas[lang]) {
        this.preguntasTraducidas[lang] = {};
      }
      // Guardamos la respuesta (res es el string que viene de Railway)
      this.preguntasTraducidas[lang][idPregunta] = res;
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error en Railway:', err);
      this.cargando = false;
    }
  });
}

}
