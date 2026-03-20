  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Respuesta } from '../models/respuesta';
  import { Observable } from 'rxjs';

  @Injectable({ providedIn: 'root' })
  export class RespuestaService {
    //private api = 'http://localhost:8080/api/respuestas';
      private api = 'https://backend-cloudv2-production-1443.up.railway.app/api/respuestas';

    constructor(private http: HttpClient) {}

  subirFoto(file: File,usuarioId: string): Observable<string> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('usuarioId', usuarioId);

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


  // ESTE ES EL ÚNICO MÉTODO QUE NECESITAS PARA GUARDAR TODO
  guardarRespuestas(respuestas: Respuesta[]): Observable<Respuesta[]> {
    // Al enviar la lista a la raíz del API, el nuevo Java inteligente hará el resto
    return this.http.post<Respuesta[]>(this.api, respuestas);
  }



  }
