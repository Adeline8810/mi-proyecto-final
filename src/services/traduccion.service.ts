import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TraduccionService {

  // Tu URL de Railway
  private apiTranslate = 'https://backend-cloudv2-production-1443.up.railway.app/api/respuestas/traducir';

  constructor(private http: HttpClient) { }

  traducir(texto: string, target: string): Observable<string> {
    // 📦 Creamos el cuerpo que espera el Backend (bodyRequest en Java)
    const body = {
      texto: texto,
      target: target
    };

    // 🚀 Enviamos por POST y extraemos el campo "traducido" del JSON de respuesta
    return this.http.post<any>(this.apiTranslate, body).pipe(
      map(res => res.traducido)
    );
  }
}
