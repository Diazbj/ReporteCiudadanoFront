import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReporteDTO } from '../dto/reporte-dto';
import { MensajeOpcionalDTO } from '../dto/mensaje-opcional-dto';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { CrearReporteDTO } from '../dto/crear-reporte-dto';
import { EditarReporteDTO } from '../dto/editar-reporte-dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private reportesURL = "https://reportesciudadanos.onrender.com/api/reportes";

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  public obtenerReportesCerca(latitud: number, longitud: number): Observable<MensajeOpcionalDTO<ReporteDTO[]>> {
    const headers = this.getAuthHeaders();

    const params = new HttpParams()
      .set('latitud', latitud.toString())
      .set('longitud', longitud.toString());

    return this.http.get<MensajeOpcionalDTO<ReporteDTO[]>>(`${this.reportesURL}/ubicacion`, { headers, params });
  }

  public obtenerReportesUsuario(): Observable<MensajeDTO> {
    const headers = this.getAuthHeaders();
    return this.http.get<MensajeDTO>(`${this.reportesURL}/usuario`, { headers });
  }

  public crearReporte(reporte: CrearReporteDTO): Observable<MensajeDTO> {
    const headers = this.getAuthHeaders();
    return this.http.post<MensajeDTO>(this.reportesURL, reporte, { headers });
  }

  public editarReporte(id: string, reporte: EditarReporteDTO): Observable<MensajeDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<MensajeDTO>(`${this.reportesURL}/${id}`, reporte, { headers });
  }

  public obtenerReportePorId(id: string): Observable<ReporteDTO> {
    const headers = this.getAuthHeaders();
    return this.http.get<MensajeDTO>(`${this.reportesURL}/${id}`, { headers })
      .pipe(
        map((respuesta: MensajeDTO) => respuesta.mensaje as ReporteDTO)
      );
  }

  public eliminarReporte(id: string): Observable<MensajeDTO> {
    const headers = this.getAuthHeaders();
    return this.http.delete<MensajeDTO>(`${this.reportesURL}/${id}`, { headers });
  }

  public marcarImportante(id: string): Observable<MensajeDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<MensajeDTO>(`${this.reportesURL}/${id}/importante`, {}, { headers });
  }
}
