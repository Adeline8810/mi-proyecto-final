import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TraduccionService {

  // 1. Definimos las URLs base correctamente
  private apiBase = 'https://backend-cloudv2-production-1443.up.railway.app/api';

  // Estas son las que causaban error si no estaban bien declaradas:
  private apiUsuarios = 'https://backend-cloudv2-production-1443.up.railway.app/api/usuarios';
  private apiRespuestas = 'https://backend-cloudv2-production-1443.up.railway.app/api/respuestas';

  constructor(private http: HttpClient) { }

  // Método de traducción (Ya lo tienes bien, solo aseguro la URL)
  traducir(texto: string, target: string): Observable<string> {
    const body = { texto, target };
    return this.http.post<any>(`${this.apiRespuestas}/traducir`, body).pipe(
      map(res => res.traducido)
    );
  }

 buscarUsuarios(nombre: string): Observable<any[]> {
    // Uso de comillas invertidas `` para las variables
    return this.http.get<any[]>(`${this.apiUsuarios}/buscar-usuarios?nombre=${nombre}`);
  }

  buscarRespuestasPorAmigo(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiRespuestas}/buscar-por-nombre?nombre=${nombre}`);
  }
}
