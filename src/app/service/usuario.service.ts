import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearUsuarioDTO } from '../dto/usuario/crear-usuario-dto';
import { UsuarioActivacionDTO } from '../dto/usuario/usuario-activacion-dto';
import { CambiarPasswordDTO } from '../dto/cambiar-password-dto';
import { TokenService } from './token.service';
import { EditarUsuarioDTO } from '../dto/editar-usuario-dto';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private apiUrl='http://localhost:8080/api/usuarios'

  constructor(private http:HttpClient,
    private tokenService: TokenService
  ) { 

  }

  crearUsuario(usuario: CrearUsuarioDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.apiUrl}`, usuario);
  }

  activarCuenta(activacion:UsuarioActivacionDTO):Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.apiUrl}/Activar`,activacion);
  }

  cambiarPassword(cambiarPasswordDTO: CambiarPasswordDTO):Observable<MensajeDTO>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<MensajeDTO>(`${this.apiUrl}/password`, cambiarPasswordDTO, {headers} );
  }

  editarUsuario(editarUsuarioDTO: EditarUsuarioDTO):Observable<MensajeDTO>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<MensajeDTO>(`${this.apiUrl}`, editarUsuarioDTO, {headers} );
  }

  eliminarUsuario():Observable<MensajeDTO>{
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<MensajeDTO>(`${this.apiUrl}/eliminar`, {headers} );
  }

}
