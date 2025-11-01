import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../../servicios/reporte.service';
import { ReporteDTO } from '../../../dto/reporte-dto'; 
import { MensajeDTO } from '../../../dto/mensaje-dto'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportes-usuario',
  templateUrl: './reportes-usuario.component.html',
  styleUrls: ['./reportes-usuario.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule]
})
export class ReportesUsuarioComponent implements OnInit {

  reportes: ReporteDTO[] = [];

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.reporteService.obtenerReportesUsuario().subscribe({
      next: (respuesta: MensajeDTO) => {
        this.reportes = respuesta.mensaje;
        console.log('Reportes recibidos:', this.reportes);
      },
      error: (error) => {
        console.error('Error al obtener reportes del usuario:', error);
      }
    });
  }
}
