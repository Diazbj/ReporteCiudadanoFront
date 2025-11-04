import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { CategoriaDTO } from '../dto/categoria-dto';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { MensajeOpcionalCategoria } from '../dto/mensaje-opcional-categoria';
import { ObtenerCategoriaDTO } from '../dto/obtener-categoria-dto';
import { ComentarioDTO } from '../dto/comentario-dto';
import { CrearComentarioDTO } from '../dto/crear-comentario-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ModeradorService {


  private apiUrl = `${environment.apiUrl}/moderador`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {

  }

  public crearCategoria(categoriaDTO: CategoriaDTO):Observable<MensajeDTO>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<MensajeDTO>(`${this.apiUrl}/categorias`, categoriaDTO, {headers});
  }

  public obtenerCategorias():Observable<MensajeOpcionalCategoria<ObtenerCategoriaDTO[]>>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<MensajeOpcionalCategoria<ObtenerCategoriaDTO[]>>(`${this.apiUrl}/categorias`, { headers });
  }

  public editarCategoria(id: String, categoriaDTO: CategoriaDTO){

  }

  public eliminarCategoria(id: string):Observable<MensajeDTO>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<MensajeOpcionalCategoria<ObtenerCategoriaDTO[]>>(`${this.apiUrl}/categorias/${id}`, { headers });
  }

  public generarInforme(){

  }

  public obtenerComentarios(idReporte: string): Observable<MensajeDTO> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<MensajeDTO>(`${this.apiUrl}/comentarios/${idReporte}`, { headers });
  }

  public crearComentario(idReporte: string, comentario: CrearComentarioDTO): Observable<MensajeDTO> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<MensajeDTO>(`${this.apiUrl}/comentarios/${idReporte}`, comentario, { headers });
  }

  public obtenerCategoriaColor(categoriaNombre:String):Observable<MensajeDTO>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<MensajeDTO>(`${this.apiUrl}/categoria/{categoriaNombre}`, { headers });
  }

}