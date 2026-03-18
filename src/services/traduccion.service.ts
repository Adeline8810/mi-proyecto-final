import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TraduccionService {
  // Tu API de Railway
  private apiTranslate = 'https://backend-cloudv2-production-1443.up.railway.app/api/respuestas/traducir';



  constructor(private http: HttpClient) {}

  traducir(texto: string, target: string): Observable<string> {
    // Llamamos a nuestro propio Java
    return this.http.get<any>(this.apiTranslate, {
      params: { texto, target }
    }).pipe(map(res => res.traducido));
  }
}
