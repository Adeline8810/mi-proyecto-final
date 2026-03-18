import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Respuesta } from '../models/respuesta';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RespuestaService {
  //private api = 'http://localhost:8080/api/respuestas';
    private api = 'https://backend-cloudv2-production-1443.up.railway.app/api/respuestas';

  constructor(private http: HttpClient) {}

guardarRespuestas(respuestas: Respuesta[]): Observable<Respuesta[]> {
  return this.http.post<Respuesta[]>(`${this.api}/guardar-o-actualizar`, respuestas);
}

 subirFoto(file: File): Observable<string> {
  const fd = new FormData();
  fd.append('file', file);

return this.http.post(`${this.api}/upload`, fd, {
  responseType: 'text' as 'text'
});

}

actualizarRespuestas(respuestas: Respuesta[]): Observable<Respuesta[]> {
  return this.http.post<Respuesta[]>('http://localhost:8080/api/respuestas/actualizar', respuestas);
}

  obtenerRespuestasPorUsuario(usuarioId: number): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(`${this.api}/usuario/${usuarioId}`);
  }


    guardarRespuesta(r: Respuesta): Observable<Respuesta> {
    // Asegúrate de que apunte a /api/respuestas (sin palabras extra al final)
    // porque el @PostMapping en Java está en la raíz del controlador
    return this.http.post<Respuesta>(this.api, r);
  }

    // En respuesta.service.ts
    guardarOActualizar(r: Respuesta): Observable<Respuesta> {
      // Ahora la URL debe terminar en /uno para que coincida con el Java
      return this.http.post<Respuesta>(`${this.api}/uno`, r);
    }

}
