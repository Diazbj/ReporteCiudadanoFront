import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private imgURL = "https://reportesciudadanos.onrender.com/api/imagenes";

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  public subir(imagen: File): Observable<string> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    const headers = this.getAuthHeaders();
    return this.http.post(this.imgURL, formData, { headers, responseType: 'text' });
  }

  public eliminar(url: string): Observable<any> {
    const publicId = this.extractPublicId(url);
    if (!publicId) {
      return of(null);
    }
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('id', publicId);
    return this.http.delete(this.imgURL, { headers, params });
  }

  private extractPublicId(url: string): string {
    const regex = /ProyectoAlertas\/([^\.]+)/;
    const match = url.match(regex);
    return match ? `ProyectoAlertas/${match[1]}` : '';
  }
}
