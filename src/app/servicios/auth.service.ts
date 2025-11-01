import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dto/login-dto';
import { MensajeDTO} from '../dto/mensaje-dto';
import { UsuarioNuevoCodigoDTO } from '../dto/usuarios/usuario-nuevo-codigo-dto';
import { PasswordNuevoDTO } from '../dto/password-nuevo-dto';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private authURL = "http://localhost:8080/api";
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { 

  }

  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/login`, loginDTO);
  }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }

  recuperarPassword(nuevoCodigo:UsuarioNuevoCodigoDTO):Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.authURL}/login/recuperarPassword`, nuevoCodigo);
  }

  actualizarPassword(recuperarPassword:PasswordNuevoDTO):Observable<MensajeDTO>{
    return this.http.post<MensajeDTO>(`${this.authURL}/login/password/nuevo`, recuperarPassword);
  }

}