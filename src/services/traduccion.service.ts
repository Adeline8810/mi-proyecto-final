import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TraduccionService {
  // Usamos un espejo público (pueden cambiar si se caen)
  private apiTranslate = 'https://libretranslate.de/translate';

  constructor(private http: HttpClient) {}

  traducir(texto: string, target: string): Observable<string> {
    return this.http.post<any>(this.apiTranslate, {
      q: texto,
      source: "es",
      target: target,
      format: "text"
    }).pipe(map(res => res.translatedText));
  }
}
